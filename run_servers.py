import os
import re
import sys
import time
import signal
import subprocess

# Define log and file paths
WORKSPACE_DIR = os.path.dirname(os.path.abspath(__file__))
LOG_FILE = os.path.join(WORKSPACE_DIR, "tunnel.log")

print("=" * 60)
print("🚀 Starting JIET Chatbot Backend & Cloudflare Tunnel...")
print("=" * 60)

# Clear old logs if any
if os.path.exists(LOG_FILE):
    try:
        os.remove(LOG_FILE)
    except Exception:
        pass

# 1. Start FastAPI server using uvicorn
print("👉 Starting FastAPI backend (uvicorn main:app)...")
backend_proc = subprocess.Popen(
    [sys.executable, "-m", "uvicorn", "main:app", "--host", "127.0.0.1", "--port", "8000"],
    cwd=WORKSPACE_DIR,
    stdout=subprocess.DEVNULL,
    stderr=subprocess.DEVNULL
)

# Wait a brief moment for uvicorn to bind to port 8000
time.sleep(1.5)

if backend_proc.poll() is not None:
    print("❌ Failed to start FastAPI backend. Please check if port 8000 is occupied.")
    sys.exit(1)

print("✅ FastAPI backend is running on http://127.0.0.1:8000")

# 2. Start cloudflared tunnel
print("👉 Starting Cloudflare Tunnel (cloudflared)...")
with open(LOG_FILE, "w") as log_file:
    tunnel_proc = subprocess.Popen(
        ["cloudflared", "tunnel", "--url", "http://127.0.0.1:8000"],
        cwd=WORKSPACE_DIR,
        stdout=log_file,
        stderr=subprocess.STDOUT
    )

def cleanup(signum=None, frame=None):
    print("\n🛑 Shutting down servers gracefully...")
    try:
        backend_proc.terminate()
        backend_proc.wait(timeout=3)
    except Exception:
        pass
    try:
        tunnel_proc.terminate()
        tunnel_proc.wait(timeout=3)
    except Exception:
        pass
    print("👋 Goodbye!")
    sys.exit(0)

# Register signals for clean termination
signal.signal(signal.SIGINT, cleanup)
signal.signal(signal.SIGTERM, cleanup)

# 3. Poll tunnel.log for the quick tunnel URL
print("👉 Waiting for Cloudflare to assign a secure tunnel URL...")
tunnel_url = None
start_time = time.time()
timeout = 30 # seconds

while time.time() - start_time < timeout:
    if os.path.exists(LOG_FILE):
        with open(LOG_FILE, "r") as f:
            content = f.read()
            match = re.search(r"https://[a-zA-Z0-9-]+\.trycloudflare\.com", content)
            if match:
                tunnel_url = match.group(0)
                break
    time.sleep(0.5)

if tunnel_url:
    print("\n" + "=" * 60)
    print("🎉 SECURE TUNNEL ONLINE!")
    print(f"🔗 URL: \033[1;36m{tunnel_url}\033[0m")
    print("=" * 60)
    print("\n💡 INSTRUCTIONS:")
    print("1. Open your web app (e.g. kschouhanpali-coder.github.io).")
    print("2. Expand the 'Settings' section on the left sidebar.")
    print("3. Paste the URL above into the 'Backend / Tunnel URL' field.")
    print("4. Click the save checkmark icon (✔️) next to it.")
    print("✨ That's it! Your chatbot will now communicate with the local server permanently.")
    print("\n👉 Press Ctrl+C at any time to stop the server and tunnel.")
else:
    print("⚠️ Could not retrieve quick tunnel URL automatically in 30 seconds.")
    print(f"👉 Please check the logs in {LOG_FILE} manually.")

# Keep the script running to keep subprocesses alive
try:
    while True:
        # Check if subprocesses died
        if backend_proc.poll() is not None:
            print("❌ Backend process terminated unexpectedly.")
            cleanup()
        if tunnel_proc.poll() is not None:
            print("❌ Tunnel process terminated unexpectedly.")
            cleanup()
        time.sleep(1)
except KeyboardInterrupt:
    cleanup()

#!/usr/bin/env python3
import http.server
import socketserver
import os
import sys

# Get the directory where this script is located
script_dir = os.path.dirname(os.path.abspath(__file__))
os.chdir(script_dir)

print(f"Current directory: {os.getcwd()}", file=sys.stderr)
print(f"Files in directory: {os.listdir('.')}", file=sys.stderr)

PORT = 8080

class MyHTTPRequestHandler(http.server.SimpleHTTPRequestHandler):
    def log_message(self, format, *args):
        print(f"[Server] {format % args}", file=sys.stderr)

Handler = MyHTTPRequestHandler

try:
    with socketserver.TCPServer(("", PORT), Handler) as httpd:
        print(f"Server running at http://localhost:{PORT}/", file=sys.stderr)
        print(f"Serving from: {os.getcwd()}", file=sys.stderr)
        httpd.serve_forever()
except Exception as e:
    print(f"Error: {e}", file=sys.stderr)
    sys.exit(1)

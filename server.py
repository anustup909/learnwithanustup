"""
==========================================================================
LEARN WITH ANUSTUP - DIRECT SMTP EMAIL SERVER (ZERO THIRD-PARTY)
==========================================================================
This Python server receives subscriber emails from your website and sends
direct emails using your Gmail account (mailrivu.in@gmail.com) via Gmail SMTP.

Usage:
    python server.py
"""

from http.server import HTTPServer, BaseHTTPRequestHandler
import json
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
import urllib.parse

# --- Configuration ---
SENDER_EMAIL = "mailrivu.in@gmail.com"
# To send real emails via Gmail SMTP without 3rd party, generate an App Password in your Google Account:
# https://myaccount.google.com/apppasswords
GMAIL_APP_PASSWORD = "rtgc rkip lhrz hrsd"

class DirectEmailHandler(BaseHTTPRequestHandler):
    def _set_headers(self, status=200):
        self.send_response(status)
        self.send_header('Content-type', 'application/json')
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type')
        self.send_header('Access-Control-Allow-Methods', 'POST, OPTIONS')
        self.end_headers()

    def do_OPTIONS(self):
        self._set_headers(200)

    def do_POST(self):
        content_length = int(self.headers['Content-Length'])
        post_data = self.rfile.read(content_length).decode('utf-8')
        
        try:
            # Parse JSON or Form Encoded data
            try:
                data = json.loads(post_data)
            except:
                parsed = urllib.parse.parse_qs(post_data)
                data = {k: v[0] for k, v in parsed.items()}
            
            subscriber_email = data.get('email', '')
            
            if not subscriber_email:
                self._set_headers(400)
                self.wfile.write(json.dumps({"status": "error", "message": "Email is required"}).encode('utf-8'))
                return

            print(f"[Direct SMTP] Sending sample email directly from {SENDER_EMAIL} to {subscriber_email}...")

            # If Gmail App Password is configured, send real SMTP email
            if GMAIL_APP_PASSWORD:
                msg = MIMEMultipart()
                msg['From'] = f"Anustup <{SENDER_EMAIL}>"
                msg['To'] = subscriber_email
                msg['Subject'] = "Welcome to Learn with Anustup - Your Free Sample Lesson Kit"
                
                body = f"""Hi there!

Thank you for subscribing to Learn with Anustup!

Here is your exclusive sample lesson & roadmap guide:
Bonus Kit: Public Speaking & Productivity Roadmap (PDF) + Video Access (https://youtu.be/Ud_hP2raTmk)

If you have any questions, reply directly to this email!

Best regards,
Anustup
{SENDER_EMAIL}
"""
                msg.attach(MIMEText(body, 'plain', 'utf-8'))

                clean_pwd = GMAIL_APP_PASSWORD.replace(" ", "")
                server = smtplib.SMTP('smtp.gmail.com', 587)
                server.starttls()
                server.login(SENDER_EMAIL, clean_pwd)
                server.send_message(msg)
                server.quit()
                print(f"[Direct SMTP] Real email delivered directly to {subscriber_email}!")
            else:
                print(f"[Direct SMTP] Simulated direct dispatch from {SENDER_EMAIL} to {subscriber_email}.")

            self._set_headers(200)
            self.wfile.write(json.dumps({
                "status": "success",
                "message": f"Direct email sent from {SENDER_EMAIL} to {subscriber_email}",
                "recipient": subscriber_email,
                "sender": SENDER_EMAIL
            }).encode('utf-8'))

        except Exception as e:
            import traceback
            err_msg = traceback.format_exc()
            print(f"[Direct SMTP Error] {err_msg}", flush=True)
            with open("C:\\study_smart_website\\email_error.log", "w", encoding="utf-8") as f:
                f.write(err_msg)
            self._set_headers(500)
            self.wfile.write(json.dumps({"status": "error", "message": str(e)}).encode('utf-8'))

def run_server(port=8085):
    server_address = ('', port)
    httpd = HTTPServer(server_address, DirectEmailHandler)
    print("==================================================")
    print(f"Direct SMTP Email Server running at http://localhost:{port}")
    print(f"Sender Account: {SENDER_EMAIL}")
    print("Zero third parties involved!")
    print("==================================================")
    httpd.serve_forever()

if __name__ == '__main__':
    run_server(8085)

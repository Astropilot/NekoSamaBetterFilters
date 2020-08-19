import os
from threading import Thread
from flask import current_app
from flask_mail import Message


def send_async_mail(app, msg):
    with app.app_context():
        app.mail.send(msg)


def send_mail_html(subject, recipients, body, inline_images=None):
    app = current_app._get_current_object()
    msg = Message(
        subject,
        recipients=recipients
    )

    msg.html = body

    if inline_images is not None:
        for image in inline_images:
            with app.open_resource(image['path']) as f:
                msg.attach(
                    os.path.basename(image['path']),
                    image['mimetype'],
                    f.read(),
                    'inline',
                    headers=[['Content-ID', f'<{image["content_id"]}>']]
                )
    thr = Thread(target=send_async_mail, args=[app, msg])
    thr.start()

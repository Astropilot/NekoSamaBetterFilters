from flask import current_app
import os
import codecs

from edtvelizytv import scheduler
from edtvelizytv.db import get_db
from edtvelizytv.utils.chronos import get_chronos_file


def fetch_animes():
    with scheduler.app.app_context():
        db = get_db()
        view_groups = db.execute(
            'SELECT group_id'
            ' FROM groups'
        ).fetchall()
        for group in view_groups:
            xml_file = get_chronos_file(group['group_id'])
            if not xml_file is None:
                new_file = codecs.open(os.path.join(current_app.instance_path, 'tmp', '%s.xml' % group['group_id']), "w", "utf-8")
                new_file.write(xml_file)
                new_file.close()

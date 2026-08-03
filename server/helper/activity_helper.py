from datetime import datetime, timezone
from config.db import activity_collection


def log_activity(actor: str, action: str, target: str):
    """
    Save an activity log.
    Example:
    actor  -> "Bilal Ahmed"
    action -> "uploaded book"
    target -> "Artificial Intelligence"
    """

    if actor:
        words = actor.strip().split()

        if len(words) == 1:
            initials = words[0][:2].upper()
        else:
            initials = (
                words[0][0] + words[1][0]
            ).upper()
    else:
        initials = "NA"

    activity = {
        "actor": actor,
        "initials": initials,
        "action": action,
        "target": target,
        "time": datetime.now(timezone.utc)
    }

    activity_collection.insert_one(activity)
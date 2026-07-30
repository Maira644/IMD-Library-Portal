from pymongo import ReturnDocument
from config.db import counter_collection


def generate_incharge_id():

    counter = counter_collection.find_one_and_update(
        {"_id": "incharge"},
        {"$inc": {"sequence_value": 1}},
        return_document=ReturnDocument.AFTER,
        upsert=True
    )

    number = counter["sequence_value"]

    return f"INC-{number:03d}"

import requests
from elasticsearch import Elasticsearch
import json
from Packet import FLASK_URL, NUM_OF_BATCHS, Packet, INDEX_NAME, POPULATE_BATCH, ELASTIC_URL


def delete_and_init_index():
    elastic = Elasticsearch([ELASTIC_URL], verify_certs=True)
    if elastic.indices.exists(index=INDEX_NAME):
        elastic.indices.delete(index=INDEX_NAME)
    # Packet.init()
    mapping_file = open("mapping.json", "r")
    mapping = json.load(mapping_file)
    elastic.indices.create(index=INDEX_NAME,body=mapping,ignore=400)


def populate_index():
    for _ in range(0, NUM_OF_BATCHS):
        packets = [Packet.generate_random_packet().to_json()
                   for _ in range(POPULATE_BATCH)]  # POPULATE_BATCH
        r = requests.post(
            f"{FLASK_URL}/bulk-add-packets",
            json=json.dumps(packets))
        print(f"{_ * POPULATE_BATCH} / {NUM_OF_BATCHS * POPULATE_BATCH} generated")


def main():
    delete_and_init_index()
    print("Start populating index!")
    populate_index()
    print("Done populating index!")


if __name__ == "__main__":
    main()

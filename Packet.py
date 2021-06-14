from random import randint, choice
from datetime import datetime
from elasticsearch.client import Elasticsearch
from elasticsearch_dsl import Document, Date, Keyword, Boolean
from typing import Dict
from elasticsearch_dsl import connections

PORT_RANGE = 65535
IPV4_SEGMENT_RANGE = 255
PROTOCOLS = ["UDP", "TCP"]
IPV4_LENGTH_OF_SEGMENTS = 4
INDEX_NAME = "packets-index"
POPULATE_AMOUNT = 5_000
POPULATE_BATCH = 500
PER_PAGE = 30
AUTOCOMP_LIMIT = 10
ELASTIC_URL = "http://es01:9200"
# ELASTIC_PORT = 9200
NUM_OF_BATCHS = 10
FLASK_URL = "http://localhost:5000"


def random_ip() -> str:
    return '.'.join(str(randint(0, IPV4_SEGMENT_RANGE)) for _ in range(IPV4_LENGTH_OF_SEGMENTS))


def random_port() -> int:
    return randint(0, PORT_RANGE)


def random_protocol() -> str:
    return choice(PROTOCOLS)


def random_action() -> bool:
    return bool(randint(0, 1))  # ACCEPTED, or DROPPED,

connections.create_connection(hosts=["es01"])
class Packet(Document):
    source_ip = Keyword()  # Ip()
    dest_ip = Keyword()  # Ip()
    source_port = Keyword()  # Integer()
    dest_port = Keyword()  # Integer()
    protocol = Keyword()
    action = Boolean()

    class Index:
        name = INDEX_NAME

    def save(self, **kwargs):
        return super(Packet, self).save(**kwargs, verify_certs=True)

    def to_json(self) -> Dict:
        return {
            "source_ip": self.source_ip,
            "dest_ip": self.dest_ip,
            "source_port": self.source_port,
            "dest_port": self.dest_port,
            "protocol": self.protocol,
            "action": self.action,
        }

    @classmethod
    def from_json(self, json_: Dict):
        packet = Packet(source_ip=json_["source_ip"],
                        dest_ip=json_["dest_ip"],
                        source_port=json_["source_port"],
                        dest_port=json_["dest_port"],
                        protocol=json_["protocol"],
                        action=json_["action"])
        return packet

    @classmethod
    def generate_random_packet(self):
        packet = Packet(source_ip=random_ip(),
                        dest_ip=random_ip(),
                        source_port=random_port(),
                        dest_port=random_port(),
                        protocol=random_protocol(),
                        action=random_action())
        return packet

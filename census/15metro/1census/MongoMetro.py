
"""
Interact with a MongoDB
that contains metro data

start mongodb by running
$ mongod
"""

from pymongo import MongoClient

client = MongoClient()
#client = MongoClient('localhost', 27017)
#client = MongoClient('mongodb://localhost:27017/')

# make a db
db = client['dummy']

# make a collection
collection = db['dummycollection']

# make a document
payload = {}
payload['z'] = 10
payload['y'] = 9
payload['x'] = 8

my_id = collection.insert(payload)

print my_id

import pdb; pdb.set_trace()

print db.collection_names(include_system_collections=False)




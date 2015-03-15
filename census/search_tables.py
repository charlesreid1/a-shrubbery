import json
import urllib2
import logging 

# --------------------------
# Set up logging
filename = 'tables.log'
logging.basicConfig(level=logging.INFO,
                    format='%(message)s',
                    datefmt='',
                    filename=filename,
                    filemode='w')
# --------------------------


term = 'housing'

url = "http://api.censusreporter.org/1.0/table/search?q="+term

results = json.load(urllib2.urlopen(url))

d = {}
for result in results:
    key = result['table_id']
    val = result['table_name'] 
    if key not in d.keys():
        d[key] = val
        logging.info(key + " - " + val)

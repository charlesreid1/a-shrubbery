import json
import urllib2

url = "http://api.censusreporter.org/1.0/table/search?q=poverty" 

results = json.load(urllib2.urlopen(url))

for result in results:
    print result['table_id']," - ",result['simple_table_name']


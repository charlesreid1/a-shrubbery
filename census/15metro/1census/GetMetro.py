import json
import urllib2
import numpy as np
import re
import os
import subprocess
from collections import OrderedDict


"""
This script gets census tracts in our metropolitan area.
"""

def main():


    # CSBA codes
    metro_json_file = 'metros.json'

    with open(metro_json_file,'r') as f:
        metroCodes = json.load(f)


    # from http://www.census.gov/prod/cen2010/doc/sf1.pdf 
    # page 119
    metro_level = "310"
    censustract_level = "140"



    # =============================================
    # Census Reporter API:
    # GeoJSON for Census Tracts in Metro Areas

    geo_api_url   = "http://api.censusreporter.org/1.0/geo/show/tiger2013?geo_ids=GEOID"
    table_api_url = "http://api.censusreporter.org/1.0/data/show/latest?table_ids=TABLEID&geo_ids=GEOID"

    for ii,(metro_name,metro_id) in enumerate(zip(metroCodes.keys(),metroCodes.values())):
        
        target_geoid = censustract_level + "|" + metro_level + "00" + "US" + str(metro_id)

        metro_api_call = re.sub('GEOID',target_geoid,geo_api_url)

        metros = json.load(urllib2.urlopen(metro_api_call))
        metro_data   = metros['features']
        metro_geoids = [metro['properties']['geoid'] for metro in metro_data]
        metro_names  = [metro['properties']['name']  for metro in metro_data]

        print "Doing",metro_name
        with open(str(ii)+".file","w") as f:
            f.write(metro_name)
            for i in range(len(metros['features'])):
                f.write(metros['features'][i]['properties']['name'])
        print "Done"


    # =============================================
    # Census Reporter API:
    # Table for Census Tracts in Metro Areas

    tables = []



    print "Done with everything"



if __name__=="__main__":
    main()

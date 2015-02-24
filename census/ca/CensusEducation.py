import json
import urllib2
import numpy as np
import re

from util import *

"""
Sex by Educational Attainment


A terse, well-manicured script
beats a clunky object hierarchy
any day.
"""

def main():

    table_id = "B15002"

    states = ["CA"]

    ################
    # Census.gov constants
    state_level = "040"
    county_level = "050"
    censustract_level = "140"

    ################
    # Census Reporter
    # API Endpoints
    geo_api_url   = "http://api.censusreporter.org/1.0/geo/show/tiger2013?geo_ids=GEOID"
    table_api_url = "http://api.censusreporter.org/1.0/data/show/latest?table_ids=TABLEID&geo_ids=GEOID"


    # Dump one json file per state

    for state in states:

        # Structure of final data
        # is a dictionary of 
        # dictionaries.
        #
        # education.keys() = county geoids
        # education.values() = census tract geojson

        education = []
        filename = "education_"+state+".geo.json"

        # Loop through every county in the state.
        # 
        # Target is counties in the state.

        fips = state2fips(state)
        target_geoid = county_level + "|" + state_level + "00" + "US" + fips

        # construct the api call for counties in the state
        counties_api_call = re.sub('GEOID',target_geoid,geo_api_url)

        counties = json.load(urllib2.urlopen(counties_api_call))
        county_data   = counties['features']
        county_geoids = [county['properties']['geoid'] for county in county_data]
        county_names  = [county['properties']['name']  for county in county_data]
        

        for gid,gname in zip(county_geoids,county_names):

            print "Downloading data for "+gname

            target_geoid = censustract_level + "|" + gid
            
            table_api_call = re.sub('TABLEID', table_id, table_api_url)
            table_api_call = re.sub('GEOID',   target_geoid,      table_api_call)

            results = json.load(urllib2.urlopen(table_api_call))

            education.append(results)


        with open(filename,'w') as f:
            f.write(str([json.dumps(ed,f) for ed in education]))
            print "Wrote file "+filename



if __name__=="__main__":
    main()


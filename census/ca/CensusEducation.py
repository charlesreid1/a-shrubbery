import json
import urllib2
import numpy as np
import re
import os
import subprocess
from collections import OrderedDict

from util import *

"""
Sex by Educational Attainment


A terse, well-manicured script
beats a clunky object hierarchy
any day.


Data at the level of census tracts is extremely large,
and slow to load. Instead, we use Python to put GeoJson
data for each county's census tracts into separate files.

Because the map is set up to view census tract level information
one county at a time, we don't need to load data for 
every census tract in the entire state anyway.

"""

def main():

    table_id = "B15002"

    states = ["CA"]

    datdir = "educationca.geojson"
    os.mkdir(datdir)

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



    for state in states:

        # Structure of final data
        # is a single GeoJson dictionary,
        # one county per file,
        # to prevent huge slowdown 
        # trying to load everything into 
        # memory.

        # Loop through every county in the state.
        # 
        # Target is counties in the state.

        fips = state2fips(state)
        target_geoid = county_level + "|" + state_level + "00" + "US" + fips

        # construct the api call for geojson 
        # for counties in the state
        counties_api_call = re.sub('GEOID',target_geoid,geo_api_url)

        counties = json.load(urllib2.urlopen(counties_api_call))
        county_data   = counties['features']
        county_geoids = [county['properties']['geoid'] for county in county_data]
        county_names  = [county['properties']['name']  for county in county_data]
        

        # Now we look up census data for this county
        table_api_call = re.sub('TABLEID', table_id, table_api_url)
        table_api_call = re.sub('GEOID',   target_geoid,      table_api_call)

        # process results

        results = json.load(urllib2.urlopen(table_api_call))


        # ----------------
        # First, do your calculations.

        # list, one item per census tract
        properties_to_embed = []
        
        for ii,county_geoid in enumerate(county_geoids):
        
            county_data = {}

            county_data = process_B15002( results['data'][county_geoid][table_id]['estimate'] )

            properties_to_embed.append(county_data)


        # ----------------
        # Second, assign your calculated value.

        for ii, county_geoid in enumerate(county_geoids):

            county_properties = properties_to_embed[ii]

            for key in county_properties.keys():

                counties['features'][ii]['properties'][key] = county_properties[key]


        filename = datdir+"/"+"educationca.geo.json"

        with open(filename,'w') as f:
            f.write( json.dumps(counties,sort_keys=True) )

        print "Finished adding properties to GeoJson for state "+state





        for gid,gname in zip(county_geoids,county_names):

            # Now we need to download all census tract info
            target_geoid = censustract_level + "|" + gid
            
            censustracts_api_call = re.sub('GEOID',target_geoid,geo_api_url)
            
            # GeoJson for census tracts
            censustracts = json.load(urllib2.urlopen(censustracts_api_call))
            censustract_data   = censustracts['features']
            censustract_geoids = [censustract['properties']['geoid'] for censustract in censustract_data]
            censustract_names  = [censustract['properties']['name']  for censustract in censustract_data]


            # Now we look up census data for this county
            table_api_call = re.sub('TABLEID', table_id, table_api_url)
            table_api_call = re.sub('GEOID',   target_geoid,      table_api_call)

            # process results

            results = json.load(urllib2.urlopen(table_api_call))


            # ----------------
            # First, do your calculations.

            # list, one item per census tract
            properties_to_embed = []
            
            for ii,censustract_geoid in enumerate(censustract_geoids):
        
                censustract_data = {}

                censustract_data = process_B15002( results['data'][censustract_geoid][table_id]['estimate'] )

                properties_to_embed.append(censustract_data)

            
            # ----------------
            # Second, assign your calculated value.

            for ii, censustract_geoid in enumerate(censustract_geoids):

                censustract_properties = properties_to_embed[ii]

                for key in censustract_properties.keys():

                    censustracts['features'][ii]['properties'][key] = censustract_properties[key]


            filename = datdir+"/"+"educationca"+gid+".geo.json"

            with open(filename,'w') as f:
                f.write( json.dumps(censustracts,sort_keys=True) )

            print "Finished adding properties to GeoJson for county "+gname 





def process_B15002(data):
    """
    5 education levels:
    
    0       Less than high school 
    1       High school, associates degree, partial college
    2       Bachelors degree
    3       Masters or Professional
    4       Doctorate
    (5)     Total

    Two sexes:
    (+)     Male
    (*)     Female

    
    Keys look like this:

    Male_Total
    Male_EdLevel0
    Male_EdLevel1
    ...
    Female_Total
    Femael_EdLevel0
    Femael_EdLevel1
    ...
    """


    # NOTE:
    # All of this crap is necessary, 
    # because we're trying to aggregate
    # the long list of Census-provided tags
    # into a shorter list.
    # 
    # The 5-item list above.
    #
    # So we aggregate keys. 
    # This is a bottleneck: you gotta hard-code
    # values whatever you do.
    # 
    # That's why this method is particular 
    # to this census table.



    # Table Keys
    # ----------------

    #######
    # DOODZ
    edM_censuskeys = OrderedDict()

    # Males with less than high school education
    edM_censuskeys['0'] = ["B15002003",
                           "B15002004",
                           "B15002005",
                           "B15002006",
                           "B15002007",
                           "B15002008",
                           "B15002009",
                           "B15002010"]

    # Males with high school, associates, or some college education
    edM_censuskeys['1'] = ["B15002011",
                           "B15002012",
                           "B15002013",
                           "B15002014"]

    # Males with Bachelors
    edM_censuskeys['2'] = ["B15002015"]

    # Males with Masters or Prof.
    edM_censuskeys['3'] = ["B15002016",
                           "B15002017"]

    # Males with doctorates
    edM_censuskeys['4'] = ["B15002018"]

    # Total males
    edM_censuskeys['Total'] = ["B15002002"]




    #######
    # GURLZ
    edF_censuskeys = OrderedDict()

    # Females with less than high school education
    edF_censuskeys['0'] = ["B15002020",
                           "B15002021",
                           "B15002022",
                           "B15002023",
                           "B15002024",
                           "B15002025",
                           "B15002026",
                           "B15002027"]

    # Females with high school, associates, or some college education
    edF_censuskeys['1'] = ["B15002028",
                           "B15002029",
                           "B15002030",
                           "B15002031"]

    # Females with Bachelors
    edF_censuskeys['2'] = ["B15002032"]

    # Females with Masters or Prof.
    edF_censuskeys['3'] = ["B15002033",
                           "B15002034"]

    # Females with doctorates
    edF_censuskeys['4'] = ["B15002035"]

    # Total females
    edF_censuskeys['Total'] = ["B15002019"]





    ###################################
    #
    # Done storing keys. 
    # Now let's use them.

    
    # This is what we'll return at the end.
    processed_results = {}


    # Here's what's about to go down:
    #
    # Each male and female education group bin
    # (as defined by me) consists of a couple of 
    # Census groups. These are the B1500 codes above.
    # These are the "census keys" being used.
    #
    # These values are fetched and summed, to yield
    # a final value for each bucket (as defined 
    # by me). These are the values that are stored
    # in the GeoJson.
    #
    # Male:
    #   Total
    #   Education level 0
    #   Education level 1
    #   ...
    # Female:
    #   Total
    #   Education level 0
    #   Education level 1
    #   ...
    #
    for kM,kF in zip(edM_censuskeys.keys(),edF_censuskeys.keys()):

        census_keys_M = edM_censuskeys[kM]
        census_keys_F = edF_censuskeys[kF]


        if kM<>"Total":
            property_key_M = "Males_Ed"+kM
        else:
            property_key_M = "Males_"+kM

        property_value_M = 0
        for census_key_M in census_keys_M:
            property_value_M += data[census_key_M]


        if kF<>"Total":
            property_key_F = "Females_Ed"+kF
        else:
            property_key_F = "Females_"+kF

        property_value_F = 0
        for census_key_F in census_keys_F:
            property_value_F += data[census_key_F]



        if kM<>"Total":
            property_key_T = "Total_Ed"+kM
        else:
            property_key_T = "Total_"+kM


        processed_results[property_key_M] = property_value_M
        processed_results[property_key_F] = property_value_F
        processed_results[property_key_T] = (property_value_M+property_value_F)


    return processed_results




if __name__=="__main__":
    main()

























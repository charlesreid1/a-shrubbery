import json
import numpy as np
from StateCounties import StateCounties

"""
Sex by Educational Attainment
"""

def main():

    filename = 'cacommuterincome.geojson'
    table_id = "B15002"

    states = ['CA']

    for state in states:

        s = StateCounties(state)

        d = s.get_counties_geojson()
        with open(state+'.json','w') as f:
            #f.write(json.dumps(d))
            json.dump(d,f)
            print "Wrote file "+state+".json"


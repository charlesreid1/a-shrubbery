import json
import urllib2
from FIPSCodes import getStateCode

"""
Census Reporter
NC Counties

This is using the Census Reporter API to 
create GeoJSON maps with information about
NC counties.
"""

class StateCounties(object):
    """
    Populates information for counties of a given state
    """

    def __init__(self,state):
        """
        Populates information about this state.
        """
        self.state = state
        self.fips = getStateCode(self.state)



    def populate(self):

        counties_url = "http://api.censusreporter.org/1.0/geo/show/tiger2013?geo_ids=050|04000US"+self.fips

        counties = json.load(urllib2.urlopen(counties_url))
        self.county_data = counties['features']
        # 58 elements, one for each county

        self.county_geoids = [county['properties']['geoid'] for county in self.county_data]
        self.county_names  = [county['properties']['name']  for county in self.county_data]

    def lookup_table(self,table_id):

        url = "http://api.censusreporter.org/1.0/data/show/latest?table_ids="+table_id+"&geo_ids=050|04000US"+self.fips
        
        results = json.load(urllib2.urlopen(url))

        return results


    def get_counties_geojson(self):

        self.populate()

        url = "http://api.censusreporter.org/1.0/geo/show/tiger2013?geo_ids=050|04000US"+self.fips

        results = json.load(urllib2.urlopen(url))

        self.county_geojson = results 

        return self.county_geojson 




if __name__=="__main__":
    #ca = StateCounties('CA')
    #print ca.get_counties_geojson()

    states = ['CA','NC']
    for state in states:
        s = StateCounties(state)
        d = s.get_counties_geojson()
        with open(state+'.json','w') as f:
            #f.write(json.dumps(d))
            json.dump(d,f)
            print "Wrote file "+state+".json"



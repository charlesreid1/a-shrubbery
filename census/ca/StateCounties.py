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

class CountyCensustracts(object):
    """
    Populates information for census tracts 
    of a given county.
    """
    def __init__(self,geoid):
        """
        Populate information about this county.
        """
        self.geoid = geoid
        print self.geoid



    def populate(self):

        counties_url = "http://api.censusreporter.org/1.0/geo/show/tiger2013?geo_ids=140|"+self.geoid

        censustracts = json.load(urllib2.urlopen(counties_url))
        self.censustract_data = censustracts['features']
        # 58 elements, one for each county

        self.censustract_geoids = [censustract['properties']['geoid'] for censustract in self.censustract_data]
        self.censustract_names  = [censustract['properties']['name']  for censustract in self.censustract_data]



    def lookup_table(self,table_id):

        url = "http://api.censusreporter.org/1.0/data/show/latest?table_ids="+table_id+"&geo_ids=140|"+self.geoid
        
        results = json.load(urllib2.urlopen(url))

        return results







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
        """
        Populate these variables:
        self.county_geoids
        self.county_names
        """

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



    def get_county_geoids(self):
        return self.county_geoids


    def get_county_names(self):
        return self.county_names


    def get_counties_geojson(self):

        self.populate()

        url = "http://api.censusreporter.org/1.0/geo/show/tiger2013?geo_ids=050|04000US"+self.fips

        results = json.load(urllib2.urlopen(url))

        self.county_geojson = results 

        return self.county_geojson 




class StateCensustracts(StateCounties):
    """
    Populates information for census tracts of a given state
    """

    def populate(self):
        """
        Populate these variables:
        self.censustract_geoids
        self.censustract_names
        """

        censustract_url = "http://api.censusreporter.org/1.0/geo/show/tiger2013?geo_ids=050|04000US"+self.fips

        censustracts = json.load(urllib2.urlopen(censustract_url))
        self.censustract_data = censustracts['features']
        # 58 elements, one for each county

        self.censustract_geoids = [censustract['properties']['geoid'] for censustract in self.censustract_data]
        self.censustract_names  = [censustract['properties']['name']  for censustract in self.censustract_data]



    def lookup_table(self,table_id):

        url = "http://api.censusreporter.org/1.0/data/show/latest?table_ids="+table_id+"&geo_ids=140|04000US"+self.fips
        
        results = json.load(urllib2.urlopen(url))

        return results



    def get_county_geoids(self):
        raise Exception("get_county_geoids() not implemented for StateCensustracts class.")


    def get_county_names(self):
        raise Exception("get_county_names() not implemented for StateCensustracts class.")


    def get_censustract_geoids(self):
        return self.censustract_geoids


    def get_censustract_names(self):
        return self.censustract_names


    def get_counties_geojson(self):
        raise Exception("get_counties_geojson() not implemented for StateCensustracts class.")


    def get_censustract_geojson(self):
        raise Exception("Whoops! Try asking for a smaller data set. Use county geoids to ask for census tract data.")





def test1():
    #ca = StateCounties('CA')
    #print ca.get_counties_geojson()

    states = ['CA','NC']
    for state in states:
        s = StateCounties(state)
        d = s.get_counties_geojson()

        filename = "counties_"+state+".json"
        with open(state+'.json','w') as f:
            #f.write(json.dumps(d))
            json.dump(d,f)
            print "Wrote file "+state+".json"


def test2():
    state = 'CA'

    s = StateCounties(state)
    s.populate()
    gs = s.get_county_geoids()

    print gs[0]



if __name__=="__main__":
    test2()



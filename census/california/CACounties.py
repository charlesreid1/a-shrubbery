import json
import urllib2

"""
Census Reporter
California Counties

This is using the Census Reporter API to 
create GeoJSON maps with information about
California counties.
"""

class CaliforniaCounties(object):
    """
    Populates information for California counties
    """

    def __init__(self):
        pass

    def populate(self):

        ca_counties_url = "http://api.censusreporter.org/1.0/geo/show/tiger2013?geo_ids=050|04000US06"

        ca_counties = json.load(urllib2.urlopen(ca_counties_url))
        self.county_data = ca_counties['features']
        # 58 elements, one for each county

        self.county_geoids = [county['properties']['geoid'] for county in self.county_data]
        self.county_names  = [county['properties']['name']  for county in self.county_data]

    def lookup_table(self,table_id):

        url = "http://api.censusreporter.org/1.0/data/show/latest?table_ids="+table_id+"&geo_ids=050|04000US06"
        
        results = json.load(urllib2.urlopen(url))

        return results


    def get_counties_geojson(self):

        url = "http://api.censusreporter.org/1.0/geo/show/tiger2013?geo_ids=050|04000US06"

        results = json.load(urllib2.urlopen(url))

        self.county_geojson = results 

        return self.county_geojson 




if __name__=="__main__":
    ca = CaliforniaCounties()
    ca.populate()
    print "works!"


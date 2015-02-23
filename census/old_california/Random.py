import json
from CACounties import CaliforniaCounties
import numpy as np



def main():
    filename = 'carandom.geojson'

    ca = CaliforniaCounties()
    ca.populate()

    results = ca.lookup_table("B08122")
    counties = ca.get_counties_geojson()



    # Modify counties, which contains GeoJSON
    #
    # add information to 
    # counties['properties'][' <new property name> ']



    county_names = [f['properties']['name'] for f in counties['features']]

    for ii,conty_names in enumerate(county_names):
        
        derived_quantity = np.random.rand()

        counties['features'][ii]['properties']['derived_quantity'] = derived_quantity



    with open(filename,'w') as f:
        f.write( json.dumps(counties) )

    print "bing! all done!"




if __name__=="__main__":
    main()


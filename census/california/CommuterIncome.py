import json
from CACounties import CaliforniaCounties
import numpy as np



def main():

    ca = CaliforniaCounties()
    ca.populate()

    results = ca.lookup_table("B08122")
    counties = ca.get_counties_geojson()



    ###################################################################
    ###################################################################
    #
    # Part 1: The target data
    #
    # The counties dictionary is a GeoJSON dictionary.
    # If we print it out, using the below command, 
    # we can see the structure:
    #
    #
    #
    # w = json.dumps( counties['features'][0], sort_keys=True, indent=4,separators=(',',': ') )
    # print w
    # 
    # {
    #     "geometry": {
    #         "coordinates": [
    #             [
    #                 [
    #                     [
    #                         -122.07282000000001,
    #                         41.183097
    #                     ],
    #                 ]
    #             ]
    #         ],
    #         "type": "MultiPolygon"
    #     },
    #     "properties": {
    #         "geoid": "05000US06089",
    #         "name": "Shasta County, CA"
    #     },
    #     "type": "Feature"
    # }
    #
    #
    #   
    # The way that we'll use counties is by adding stuff
    # to the properties field. In addition to the name
    # and GeoID, we'll add information that is useful
    # for creating our map.
    #
    # This might include an absolute value quantity,
    # plus a normalized quantity that is easier to visualize/color map.
    # 
    # We will modify counties, and dump it 
    # into a GeoJSON file.








    ##########################################################
    ##########################################################
    # 
    # Part 2
    # 
    # Census data parsing



    # # table titles:
    # z = json.dumps( results['tables'], sort_keys=True, indent=4,separators=(',',': ') )
    # print z

    # {
    #     "B08122": {
    #         "columns": {
    #             "B08122001": {
    #                 "indent": 0,
    #                 "name": "Total:"
    #             },
    #             "B08122002": {
    #                 "indent": 2,
    #                 "name": "Below 100 percent of the poverty level"
    #             },
    #             "B08122003": {
    #                 "indent": 2,
    #                 "name": "100 to 149 percent of the poverty level"
    #             },
    #             "B08122004": {
    #                 "indent": 2,
    #                 "name": "At or above 150 percent of the poverty level"
    #             },
    #             "B08122005": {
    #                 "indent": 1,
    #                 "name": "Car, truck, or van - drove alone:"
    #             },
    #             "B08122006": {
    #                 "indent": 2,
    #                 "name": "Below 100 percent of the poverty level"
    #             },
    #             "B08122007": {
    #                 "indent": 2,
    #                 "name": "100 to 149 percent of the poverty level"
    #             },
    #             "B08122008": {
    #                 "indent": 2,
    #                 "name": "At or above 150 percent of the poverty level"
    #             },
    #             "B08122009": {
    #                 "indent": 1,
    #                 "name": "Car, truck, or van - carpooled:"
    #             },
    #             "B08122010": {
    #                 "indent": 2,
    #                 "name": "Below 100 percent of the poverty level"
    #             },
    #             "B08122011": {
    #                 "indent": 2,
    #                 "name": "100 to 149 percent of the poverty level"
    #             },
    #             "B08122012": {
    #                 "indent": 2,
    #                 "name": "At or above 150 percent of the poverty level"
    #             },
    #             "B08122013": {
    #                 "indent": 1,
    #                 "name": "Public transportation (excluding taxicab):"
    #             },
    #             "B08122014": {
    #                 "indent": 2,
    #                 "name": "Below 100 percent of the poverty level"
    #             },
    #             "B08122015": {
    #                 "indent": 2,
    #                 "name": "100 to 149 percent of the poverty level"
    #             },
    #             "B08122016": {
    #                 "indent": 2,
    #                 "name": "At or above 150 percent of the poverty level"
    #             },
    #             "B08122017": {
    #                 "indent": 1,
    #                 "name": "Walked:"
    #             },
    #             "B08122018": {
    #                 "indent": 2,
    #                 "name": "Below 100 percent of the poverty level"
    #             },
    #             "B08122019": {
    #                 "indent": 2,
    #                 "name": "100 to 149 percent of the poverty level"
    #             },
    #             "B08122020": {
    #                 "indent": 2,
    #                 "name": "At or above 150 percent of the poverty level"
    #             },
    #             "B08122021": {
    #                 "indent": 1,
    #                 "name": "Taxicab, motorcycle, bicycle, or other means:"
    #             },
    #             "B08122022": {
    #                 "indent": 2,
    #                 "name": "Below 100 percent of the poverty level"
    #             },
    #             "B08122023": {
    #                 "indent": 2,
    #                 "name": "100 to 149 percent of the poverty level"
    #             },
    #             "B08122024": {
    #                 "indent": 2,
    #                 "name": "At or above 150 percent of the poverty level"
    #             },
    #             "B08122025": {
    #                 "indent": 1,
    #                 "name": "Worked at home:"
    #             },
    #             "B08122026": {
    #                 "indent": 2,
    #                 "name": "Below 100 percent of the poverty level"
    #             },
    #             "B08122027": {
    #                 "indent": 2,
    #                 "name": "100 to 149 percent of the poverty level"
    #             },
    #             "B08122028": {
    #                 "indent": 2,
    #                 "name": "At or above 150 percent of the poverty level"
    #             }
    #         },
    #         "denominator_column_id": "B08122001",
    #         "title": "Means of Transportation to Work by Poverty Status in the Past 12 Months",
    #         "universe": "Workers 16 Years and Over for Whom Poverty Status Is Determined"
    #     }
    # }




    # this is linked to information in data
    # p results['data'][self.county_geoids[3]]

    #y = json.dumps( results['data'][self.county_geoids[3]], sort_keys=True, indent=4, separators=(',',': ') )
    #print y

    #{
    #    "B08122": {
    #        "error": {
    #            "B08122001": 862.0,
    #            "B08122002": 428.0,
    #            "B08122003": 661.0,
    #            "B08122004": 1031.0,
    #            "B08122005": 933.0,
    #            "B08122006": 341.0,
    #            "B08122007": 501.0,
    #            "B08122008": 884.0,
    #            "B08122009": 508.0,
    #            "B08122010": 188.0,
    #            "B08122011": 224.0,
    #            "B08122012": 433.0,
    #            "B08122013": 124.0,
    #            "B08122014": 78.0,
    #            "B08122015": 86.0,
    #            "B08122016": 51.0,
    #            "B08122017": 391.0,
    #            "B08122018": 131.0,
    #            "B08122019": 64.0,
    #            "B08122020": 375.0,
    #            "B08122021": 222.0,
    #            "B08122022": 32.0,
    #            "B08122023": 49.0,
    #            "B08122024": 212.0,
    #            "B08122025": 405.0,
    #            "B08122026": 112.0,
    #            "B08122027": 155.0,
    #            "B08122028": 379.0
    #        },
    #        "estimate": {
    #            "B08122001": 35910.0,
    #            "B08122002": 3537.0,
    #            "B08122003": 3564.0,
    #            "B08122004": 28809.0,
    #            "B08122005": 25960.0,
    #            "B08122006": 2228.0,
    #            "B08122007": 2426.0,
    #            "B08122008": 21306.0,
    #            "B08122009": 4213.0,
    #            "B08122010": 671.0,
    #            "B08122011": 604.0,
    #            "B08122012": 2938.0,
    #            "B08122013": 212.0,
    #            "B08122014": 59.0,
    #            "B08122015": 79.0,
    #            "B08122016": 74.0,
    #            "B08122017": 2064.0,
    #            "B08122018": 268.0,
    #            "B08122019": 157.0,
    #            "B08122020": 1639.0,
    #            "B08122021": 690.0,
    #            "B08122022": 38.0,
    #            "B08122023": 33.0,
    #            "B08122024": 619.0,
    #            "B08122025": 2771.0,
    #            "B08122026": 273.0,
    #            "B08122027": 265.0,
    #            "B08122028": 2233.0
    #        }
    #    }
    #}






    ###########################################################
    ###########################################################
    # 
    # Part 3
    # 
    # Adding properties to geographic entities in GeoJSON
    #
    # We're interested in mapping things at the county level,
    # so let's loop over county entities and perform calculations
    # there.

    n_counties = len(counties['features'])
    county_names = [f['properties']['name'] for f in counties['features']]

    for ii,conty_names in enumerate(county_names):
        
        derived_quantity = np.random.rand()*10

        counties['features'][ii]['properties']['derived_quantity'] = derived_quantity



    with open('ca_derived_quantity.geojson','w') as f:
        f.write( json.dumps(counties) )

    print "bing! all done!"



if __name__=="__main__":
    main()

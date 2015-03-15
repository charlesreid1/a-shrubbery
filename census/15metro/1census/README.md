# Step 1: Extracting Census Data

Extract data from the Census Reporter API.

This task is a bit more complicated than it sounds,
since we are interested in so many different quantities.
In order to know how to call the API,
and what to do with the results it returns,
we have to decide on a data scheme.

## The Data Schema

The data will be used for two distinct purposes: 
maps (with Leaflet.js), and charts (with D3.js).

### The Geometry Table (Maps)

**Maps** - we will be creating maps with Leaflet.js 
using much of this data (for colored map overlays, for example). 
For drawing a map, we need to have a large amount of 
information about polygons and points.

This is the information returned by the Census Reporter's
geo information API:

```
http://api.censusreporter.org/1.0/geo/show/tiger2013?geo_ids=GEOID"
```

where ```GEOID``` contains information about 
the level of information requested, as well as 
the parent geographic entity. 

In our case, our ```GEOID``` looks like this:

```
GEOID = "140|31000US35620"
```

Here, 140 indicates we want to receive polygons for 
census tracts. (These numbers come from the US Census Bureau's
[Census Data Technical Manual](http://www.census.gov/prod/cen2010/doc/sf1.pdf).)

310 indicates we want to specify the parent geographic entity 
to be a metropolitan area. These are indexed using something
called a CSBA - core based statistical area. You can find a 
huge list of CSBAs for cities in the United States 
[on the Census Bureau website](http://www.census.gov/population/metro/data/def.html).
The master list is contained in a single Excel spreadsheet.

This API URL can now be used to obtain GeoJSON information containing
the polygons that make up each census tract in the metro area 
we have specified (New York, in the example above).

This information will compose our first table,
**THE GEOMETRY TABLE.**

### The Properties Table (Charts)

**Charts** - we will be creating charts with D3.js 
using properties contained in each geographic entity.
However, because we will not be using D3 to draw the maps
(note that this may change), and because we want the charts
to have quick access to this information without getting 
bogged down with geometry information, we will store this 
in a separate table.

This table will contain an aggregation of any census data
tables that we happen to find interesting and want to 
either visualize or compute statistics on.



## The MongoDB Database

We will be using MongoDB on the backend to store all of
this data and make it available for our statistical modeling
endeavors.

### GeoJson with MongoDB















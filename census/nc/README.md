# North Carolina Map

## State Counties

The state counties object will take, as an argument, 
a state name or abbreviation, and will save a GeoJson file
containing county boundaries for that state.

### How It Works

This script uses the Census Reporter API, the urllib2 library, and
JSON.

**First**, the state specified by the user must be translated to 
its corresponding FIPS code (this is a two-digit code 
unique to each state). 

I used the list of FIPS codes from [here](http://www2.census.gov/geo/docs/reference/state.txt).

I downloaded these as a text file and processed it 
using Python. I turned the text file into a dictionary,
and exported it to a JSON file for quick I/O.

**Second**, the Census Reporter API URL must be constructed.
We are using a feature of the API that allows us to request
geographic information for a particular entity. 

In this case,
we use the FIPS code to construct the GeoID of the state 
the user has specified. We then request all geographic entities
at the US county level that belongs to the state specified 
by the user.

The schema looks like this:

```
http://api.censusreporter.org/1.0/geo/show/tiger2013?geo_ids=< requested child level >|< geo ID of parent >"
```

For North Carolina, which has the FIPS code 37, 
the URL requesting all counties (050) would be:

```
http://api.censusreporter.org/1.0/geo/show/tiger2013?geo_ids=050|04000US37"
```

**Third**, the URL for the Census Reporter API is requested using the urllib2 library. 
The URL will return GeoJson, which can be processed using the Python Json library,
and turned directly into a native Python data structure - a dictionary.

Now the dictionary containing GeoJson information for the state's counties
is returned to the user. This information can be dumped to a Json file
for displaying on a map using Leaflet, Polymaps, D3, etc.


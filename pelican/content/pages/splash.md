Title: Index
PageStyle: clear
save_as: index.html


# Barry Goldwater Bombing Range Topo Map

<img width="300px" src="images/splash_barrygoldwater.png" alt="Barry Goldwater Bombing Range Topo Map" />

**Description**: Combines a tileset with contours from a shapefile,
for the purpose of enhancing or calling out particular topological
elevations or features.

**Data**: This uses a tileset from the National Map Viewer, and 
topological shapefiles that are also from the National Map Viewer.

<a class="btn btn-info btn-large" href="barrygoldwater/">See Barry Goldwater Bombing Range Topo Map &nbsp; <i class="fa fa-arrow-circle-right"></i></a>

<br />


# National Map Tileset

<img width="300px" src="images/splash_nationalmaptile.png" alt="National Map Tileset" />

**Description**: A leaflet using National Map Viewer topological map tileset for
mapping a dataset (shale gas plays dataset).

**Data**: This uses a tileset of contours in the United States - the same tileset that is 
provided by the National Map Viewer.

<a class="btn btn-info btn-large" href="nationalmaptile/">See National Map Tileset &nbsp; <i class="fa fa-arrow-circle-right"></i></a>

<br />



# My First US Census Data Map: 

## California Counties, Means of Transportation to Work by Poverty Status 

<img width="300px" src="images/splash_cacommuterincome.png" alt="My First (Basic) D3 Map" />

**Description**: This map is my first quantile map using US Census data. 
This visualizes US Census Table B08122, officially
titled, "Means of Transportation to Work by Poverty Status," compares two
variables: means of transportation, and ratio of income to poverty line.

**Data**: The data was obtained from the Census Bureau, delivered 
via the [Census Reporter API](https://github.com/censusreporter/censusreporter).
The map data is stored in a local GeoJson file and served up by this web server.

<a class="btn btn-info btn-large" href="cacommuterincome/">CA Means of Transportation by Poverty &nbsp; <i class="fa fa-arrow-circle-right"></i></a>

<br />



# California County Quantile Map

<img width="300px" src="images/splash_carandom.png" alt="County-by-County Quantile Map of California" />

**Description**: A map visualizing a random quantity for each California county. 

**Data**: The data was obtained from the Census Bureau, delivered 
via the [Census Reporter API](https://github.com/censusreporter/censusreporter).
The map data is stored in a local GeoJson file and served up by this web server.

<a class="btn btn-info btn-large" href="carandom/">California County Quantile Map &nbsp; <i class="fa fa-arrow-circle-right"></i></a>

<br />



# Feudal Japan Daimyo Boundaries Map (1664)

<img width="300px" src="images/splash_feudaljapan.png" alt="Feudal Japan Daimyo Boundaries Map" />

**Description**: A map of the boundaries of daimyos in feudal Japan, 1664 CE. 
The shapefile was uploaded to and is served up by a [Geoserver instance](http://charlesreid1.com/wiki/Geodroplet), 
and is visualized on a map using Leaflet.js.

**Data**: The data was obtained from the [Tokugawa Japan Data Archive web site](http://www.fas.harvard.edu/~chgis/japan/archive/)
at Harvard University. 

<a class="btn btn-info btn-large" href="feudaljapan/">Feudal Japan Daimyo Boundaries Map (1664) &nbsp; <i class="fa fa-arrow-circle-right"></i></a>

<br />

# EIA Shale Gas Plays Map

<img width="300px" src="images/splash_shalegasplays.png" alt="US Shale Gas Plays" />

**Description**: A map of shale gas plays in the United States, from Shapefile data provided by
the EIA. This data is provided by a custom Geoserver. The Shapefile data was added to and is
served up by a [Geoserver instance](http://charlesreid1.com/wiki/Geodroplet), and is visualized using Leaflet.js.

**Data**: The data was originally provided by the EIA, and was then added to the 
[EIA-Oil-Gas-Maps](https://github.com/talllguy/EIA-Oil-Gas-Maps) repository on GitHub,
by [@talllguy](http://github.com/talllguy).

<a class="btn btn-info btn-large" href="shalegasplays/">EIA Shale Gas Plays Map &nbsp; <i class="fa fa-arrow-circle-right"></i></a>

<br />



# NYC Streets Map

<img width="300px" src="images/splash_nycstreets.png" alt="NYC Streets Map" />

**Description**: My first Leaflet.js map, showing about 100 streets of 
New York City. The map uses MapBox and a custom 
Geoserver setup (see [charlesreid1.com for more info](http://charlesreid1.com/wiki/Geodroplet)).

**Data**: The data on this map were provided by a [Geoserver tutorial](http://docs.geoserver.org/stable/en/user/gettingstarted/web-admin-quickstart/index.html).

<a class="btn btn-info btn-large" href="nycstreets/">NYC Streets Map &nbsp; <i class="fa fa-arrow-circle-right"></i></a>



# D3 Examples


## My First D3 Map

<img width="300px" src="images/splash_d3basicmap.png" alt="My First (Basic) D3 Map" />

**Description**: This slaps together a simple map of California using D3.
This was a very different process from the one used to create a Leaflet.

**Data**: This uses the same dataset as before, of California county boundary
information obtained from the US Census Bureau
via the [Census Reporter API](https://github.com/censusreporter/censusreporter).

<a class="btn btn-info btn-large" href="d3basicmap/">See My Very Basic D3 Map &nbsp; <i class="fa fa-arrow-circle-right"></i></a>

<br />


## Barry Goldwater Bombing Range Topo Map

**Description**: A topo map of the Barry Goldwater bombing range in southwestern
Arizona. 
The map is made with D3.

**Data**: Uses shapefile data from the National Map Viewer, translated into TopoJson. 
See [charlesreid1 wiki](http://charlesreid1.com/wiki/Topo_Map#National_Map_Viewer).

<a class="btn btn-info btn-large" href="barrygoldwater_d3/">See Goldwater Bombing Range Map &nbsp; <i class="fa fa-arrow-circle-right"></i></a>

<br />


Title: About A Shrubbery
PageStyle: clear
save_as: about.html

# A Shrubbery

This is a page that hosts Leaflet.js maps.

## What is Leaflet.js?

[Leaflet.js](http://leafletjs.com/) is a Javascript library for
annotating maps. It is capable of parsing GeoJSON information
and visualizing it on top of different map tile sets.

## Geoserver Under the Hood

While the Leaflet maps are nice and pretty, they are not 
doing any heavy lifting. Ultimately, unless our data sets
are sufficiently small, all of the data being displayed in the 
maps has to be served up by a server somewhere.

Enter Geoserver.

Geoserver provides an all-purpose GIS server tool. Geoserver
is a Java webapp running on Apache Tomcat. You can, among 
other things, load data into Geoserver in the form of shapefiles,
then turn that data into JSON data streams, which can be 
fed to Leaflet maps.

## Read More

I have covered the entire process of setting up 
a Geoserver, importing data, and pushing that data
onto a map on the [charlesreid1 wiki](http://charlesreid1.com/wiki).

[Part 1 - Setting up a Digital Ocean droplet with Geoserver](http://charlesreid1.com/wiki/Geodroplet)

[Part 2 - Geoserver Tutorials and Basic Map Operations](http://charlesreid1.com/wiki/Geoserver)

[Part 3 - Mapping Arbitrary Data](http://charlesreid1.com/wiki/Geoserver_OilGas)


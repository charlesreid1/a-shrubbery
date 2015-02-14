# topojsoning: 
final.json:  Elev_Contour.json
		topojson --id-property none --simplify=0.5 -p -o barrygoldwater_new.json -- Elev_Contour.json
		# simplification approach to explore further. Feedbacks welcome. 

# shp2jsoning:
Elev_Contour.json:  Elev_Contour.shp
		ogr2ogr -f GeoJSON Elev_Contour.json Elev_Contour.shp

clean:
		rm `ls | grep -v 'zip' | grep -v 'Makefile'`
# Makefile v4b (@Lopez_lz) 

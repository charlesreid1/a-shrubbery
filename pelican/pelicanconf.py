#!/usr/bin/env python
# -*- coding: utf-8 -*- #
from __future__ import unicode_literals

from util import *

import re
import os

SITEURL = ''

AUTHOR = u'charlesreid1'
SITENAME = u'A Shrubbery'
#SITEURL = '/a-shrubbery'

make_common_js('maps/common.js',SITEURL)

PATH = 'content'

TIMEZONE = 'America/Los_Angeles'

DEFAULT_LANG = u'en'





# --------------8<---------------------

SITETAGLINE = "Building a page of map leaflets using Leaflet.js and D3.js"


# to install this theme:
# git checkout http://github.com/charlesreid1/coffin-spore-theme
# pelican-themes -i coffin-spore-theme
THEME = 'a-shrubbery-theme'


# This is stuff that goes into content/ that's copied into the website 
STATIC_PATHS = ['images']

DISPLAY_PAGES_ON_MENU = False


#DIRECT_TEMPLATES = ('index', 'archives','book','blog')

TEMPLATE_PAGES = {'blog.html':'blog.html'}


EXTRA_TEMPLATES_PATHS = ['maps']

###########################################
# Maps

# Common
TEMPLATE_PAGES['mapstyles.css'] = 'mapstyles.css'
TEMPLATE_PAGES['common.js'] = 'common.js'

# Maps
TEMPLATE_PAGES['nycstreets.html'] = 'nycstreets/index.html'
TEMPLATE_PAGES['nycstreets.js']   = 'nycstreets.js'

TEMPLATE_PAGES['shalegasplays.html'] = 'shalegasplays/index.html'
TEMPLATE_PAGES['shalegasplays.js']   = 'shalegasplays.js'

TEMPLATE_PAGES['feudaljapan.html'] = 'feudaljapan/index.html'
TEMPLATE_PAGES['feudaljapan.js']   = 'feudaljapan.js'

TEMPLATE_PAGES['carandom.html'] = 'carandom/index.html'
TEMPLATE_PAGES['carandom.js']   = 'carandom.js'
TEMPLATE_PAGES['carandom.geojson'] = 'carandom.geojson'

TEMPLATE_PAGES['cacommuterincome.html'] = 'cacommuterincome/index.html'
TEMPLATE_PAGES['cacommuterincome.js']   = 'cacommuterincome.js'
TEMPLATE_PAGES['cacommuterincome.geojson']   = 'cacommuterincome.geojson'

TEMPLATE_PAGES['d3basicmap.html'] = 'd3basicmap/index.html'
TEMPLATE_PAGES['d3basicmap.js']   = 'd3basicmap.js'
TEMPLATE_PAGES['d3basicmap.json'] = 'd3basicmap.json'

TEMPLATE_PAGES['nationalmaptile.html'] = 'nationalmaptile/index.html'
TEMPLATE_PAGES['nationalmaptile.js']   = 'nationalmaptile.js'

TEMPLATE_PAGES['barrygoldwater.html'] = 'barrygoldwater/index.html'
TEMPLATE_PAGES['barrygoldwater.js']   = 'barrygoldwater.js'
TEMPLATE_PAGES['barrygoldwater_red.json'] = 'barrygoldwater_red.json'

#TEMPLATE_PAGES['barrygoldwater_d3.html'] = 'barrygoldwater_d3/index.html'
#TEMPLATE_PAGES['barrygoldwater_d3.js']   = 'barrygoldwater_d3.js'
#TEMPLATE_PAGES['barrygoldwater_d3.json'] = 'barrygoldwater_d3.json'

TEMPLATE_PAGES['caclick.html']  = 'caclick/index.html'
TEMPLATE_PAGES['caclick.css']   = 'caclick.css'
TEMPLATE_PAGES['caclick.js']    = 'caclick.js'

TEMPLATE_PAGES['triplepie.html']  = 'triplepie/index.html'
TEMPLATE_PAGES['triplepie.css']   = 'triplepie.css'
TEMPLATE_PAGES['triplepie.js']    = 'triplepie.js'

TEMPLATE_PAGES['nccensus.html']  = 'nccensus/index.html'
TEMPLATE_PAGES['nccensus.css']   = 'nccensus.css'
TEMPLATE_PAGES['nccensus1.js']   = 'nccensus1.js'
TEMPLATE_PAGES['nccensus2.js']   = 'nccensus2.js'
TEMPLATE_PAGES['nccensus3.js']   = 'nccensus3.js'
TEMPLATE_PAGES['nccensusmain.js'] = 'nccensusmain.js'

TEMPLATE_PAGES['educationaz.html']  = 'educationaz/index.html'
TEMPLATE_PAGES['educationaz.js']    = 'educationaz.js'

TEMPLATE_PAGES['educationca.html']  = 'educationca/index.html'
TEMPLATE_PAGES['educationca.js']    = 'educationca.js'

#TEMPLATE_PAGES['educationma.html']  = 'educationma/index.html'
#TEMPLATE_PAGES['educationma.js']    = 'educationma.js'
#
#TEMPLATE_PAGES['educationnc.html']  = 'educationnc/index.html'
#TEMPLATE_PAGES['educationnc.js']    = 'educationnc.js'
#
#TEMPLATE_PAGES['educationor.html']  = 'educationor/index.html'
#TEMPLATE_PAGES['educationor.js']    = 'educationor.js'
#
#TEMPLATE_PAGES['educationut.html']  = 'educationut/index.html'
#TEMPLATE_PAGES['educationut.js']    = 'educationut.js'
#
#TEMPLATE_PAGES['educationwa.html']  = 'educationwa/index.html'
#TEMPLATE_PAGES['educationwa.js']    = 'educationwa.js'

TEMPLATE_PAGES['education.css']   = 'education.css'

TEMPLATE_PAGES['barchart_educationca.js'] = 'barchart_educationca.js'
TEMPLATE_PAGES['textblock_educationca.js'] = 'textblock_educationca.js'
TEMPLATE_PAGES['writelabels_educationca.js'] = 'writelabels_educationca.js'

TEMPLATE_PAGES['buttons.html']  = 'buttons/index.html'
TEMPLATE_PAGES['buttons.js']    = 'buttons.js'



# Add all the geojson for education maps
geojson_paths = ["maps/educationca.geojson",
                 "maps/educationaz.geojson"]
for geojson_path in geojson_paths:
    EXTRA_TEMPLATES_PATHS += [geojson_path]
    for f in os.listdir(geojson_path):
        if f.endswith(".json"):
            TEMPLATE_PAGES[f] = f


TEMPLATE_PAGES['test.html']  = 'test.html'
TEMPLATE_PAGES['test.css']   = 'test.css'

# --------------8<---------------------




# Feed generation is usually not desired when developing
FEED_ALL_ATOM = None
CATEGORY_FEED_ATOM = None
TRANSLATION_FEED_ATOM = None
AUTHOR_FEED_ATOM = None
AUTHOR_FEED_RSS = None

DEFAULT_PAGINATION = False

# Uncomment following line if you want document-relative URLs when developing
#RELATIVE_URLS = True

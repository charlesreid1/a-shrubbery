#!/usr/bin/env python
# -*- coding: utf-8 -*- #
from __future__ import unicode_literals

AUTHOR = u'charlesreid1'
SITENAME = u'A Shrubbery'
#SITEURL = '/a-shrubbery'

PATH = 'content'

TIMEZONE = 'America/Los_Angeles'

DEFAULT_LANG = u'en'





# --------------8<---------------------

SITETAGLINE = "Building a page of map leaflets using Leaflet.js"


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

# add map stuff

TEMPLATE_PAGES['mapstyles.css'] = 'mapstyles.css'

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

TEMPLATE_PAGES['barrygoldwater.html'] = 'barrygoldwater/index.html'
TEMPLATE_PAGES['barrygoldwater.js']   = 'barrygoldwater.js'
TEMPLATE_PAGES['barrygoldwater.json'] = 'barrygoldwater.json'



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

#!/usr/bin/env python
# -*- coding: utf-8 -*- #
from __future__ import unicode_literals

AUTHOR = u'charlesreid1'
SITENAME = u'A Shrubbery'
SITEURL = '/a-shrubbery'

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






# --------------8<---------------------



# Feed generation is usually not desired when developing
FEED_ALL_ATOM = None
CATEGORY_FEED_ATOM = None
TRANSLATION_FEED_ATOM = None
AUTHOR_FEED_ATOM = None
AUTHOR_FEED_RSS = None

# Blogroll
LINKS = (('Pelican', 'http://getpelican.com/'),
         ('Python.org', 'http://python.org/'),
         ('Jinja2', 'http://jinja.pocoo.org/'),
         ('You can modify those links in your config file', '#'),)

# Social widget
SOCIAL = (('You can add links in your config file', '#'),
          ('Another social link', '#'),)

DEFAULT_PAGINATION = False

# Uncomment following line if you want document-relative URLs when developing
#RELATIVE_URLS = True

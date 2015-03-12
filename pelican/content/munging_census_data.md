Title: Munging Census Data
Date: 2015-03-10 20:34
Category: 

Recently I put the finishing touches on my ["California Education Levels by 
Census Tract"](http://charlesreid1.github.io/a-shrubbery/educationca/) map. 
This map is part of my project to learn D3 by creating 
ten D3 charts.

The first D3 chart+map that I completed was
["Commute Methods by Poverty Status in California"](http://charlesreid1.github.io/a-shrubbery/triplepie).

I figured I would write up a post giving a rundown of the kind of 
munging and processing of census data that is going on behind the 
scenes to make this map. While I am not computing anything terribly
fancy, you can imagine doing some much more intricate statistical
analyses (as I plan to do) of the spatial data using more sophisticated
algorithms.

## The Census Data

We begin with the census data, which was obtained through the 
Census Reporter API to US Census Bureau data. This makes all of the
information in the Census available to everyone with a few key strokes.
After overcoming my initial feelings of being completely 
overwhelmed by how much data I had access to, I started
searching for interesting-sounding tables of data with 
keyword searches.

I soon found table B15002, which was education level by gender
for every census tract. THat meant it gave a breakdown of the 
total population over 25 years of age considered; the male and 
female populations of each category of education level; and a 
wide range of different education levels specified.

My first step was to reduce the number of categories of 
education level to a 1-to-5 scale: 1 (less than high school)
to 5 (Ph.D./medical school/law school). While this was 
somewhat arbitrary, it was dome mainly to implement a 
transform of the original data.

(To be continued...)



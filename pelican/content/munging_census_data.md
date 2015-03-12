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

## FIPS and Level Codes

Before you 

## Searching for Tables

I wrote a simple script that uses the Census Reporter API to
search for a keyword, and dump the names of resulting tables
and their census data table codes to a file. Here is that code:

```python

import json
import urllib2
import logging 

# --------------------------
# Set up logging
filename = 'tables.log'
logging.basicConfig(level=logging.INFO,
                    format='%(message)s',
                    datefmt='',
                    filename=filename,
                    filemode='w')
# --------------------------



url = "http://api.censusreporter.org/1.0/table/search?q=military" 

results = json.load(urllib2.urlopen(url))

d = {}
for result in results:
    key = result['table_id']
    val = result['table_name'] 
    if key not in d.keys():
        d[key] = val
        logging.info(key + " - " + val)

```

<a href="https://github.com/charlesreid1/a-shrubbery/blob/master/census/search_tables.py" class="btn btn-primary">Link to this file on Github</a>

I soon found table B15002, which was education level by gender
for every census tract. THat meant it gave a breakdown of the 
total population over 25 years of age considered; the male and 
female populations of each category of education level; and a 
wide range of different education levels specified.

## Munging Census Data

My first step was to reduce the number of categories of 
education level to a 1-to-5 scale: 1 (less than high school)
to 5 (Ph.D./medical school/law school). While somehwat
arbitrary, it does make the scale simpler, and therefore
easier to understand and visualize.

I used the Python collections class OrderedDict to maintain
the order in which the keys appeared, and aggregated the
keys into my new 1-5 category system. I now had two sets
of five numbers: the number of people in a given census tract
or county who were in a particular education category (1-5).
This also gives me the total number of people in each 
education category.

From there, we can start to compute some statistics on 
a given population (whether it be a state, county, or tract).

We begin with some population balance mathematics and notation.

Denoting our five education categories $i=1 \dots 5$, or more 
generally as $i = 1 \dots N_{ed}$ (in case we change the 
categorization system later), we can 
define the weight of each category as 
the total number of people
in that category:

$$
\text{Total Population} = \sum_{i=1}^{N_{ed}} w_{i}
$$

Now we can compute the population-weighted average of
a given quantity $\phi$, distributed differently among
different categories of the population, as: 

$$
\overline{\phi} = \dfrac{ \sum_{i=1}^{N_{ed}} w_{i} \phi_{i} }{ \sum_{i=1}{N_{ed}} w_{i} }
$$

But before we dive in, let us take a moment to step back
and look at this problem in a more generalized way.

## Generalizing the Problem: Population Balances

Because we are dealing with a discrete population in discrete
bins, it is simple to think about this in discrete terms.
If we were to think like computer scientists, and if we had 
never left the realm of programming, we might forever think
of the problem this way.

But to connect it with the more abstract concept of a population 
balance, and computing statistics over continuously-varying properties
for continuous population distributions (e.g., particle size
distributions), leads to a much richer understanding of the 
problem.

If we imagine the differences in education levels becoming 
smaller and smaller - or perhaps being measured with something
quantitative like "total number of hours of education" 
instead of a discrete quantity like "last grade level/degree" -
then the summations in this equation become integrals.
That is,

$$
\overline{\phi} = \dfrac{ \sum_{i=1}^{N_{ed}} w_{i} \phi_{i} }{ \sum_{i=1}{N_{ed}} w_{i} }
$$

becomes:

$$
\overline{\phi} = \dfrac{ \int_{\phi^{\prime}=-\infty}^{+\infty} n(\phi^{\prime}) p(\phi^{\prime}) d \phi^{\prime} }{1}
$$

(In reality, the limits of the integral may be limited to a
given range...).










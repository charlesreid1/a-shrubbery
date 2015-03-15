# 15 Metro: The Statistical City

This folder contains the beginnings of the 15 Metro webapp.

**15 Metro: The Statistical City** is a webapp that uses 
census data to give a statistical summary of the 
15 largest metropolitan areas in the United States (according to 
Wikipedia). This project explores similarities and differences
in big cities around the United States, and is a way of 
interactively exploring a large, multivariate dataset.

This webapp uses D3.js, Leaflet.js, and Angular.js on the frontend,
and Flask (maybe Node.js) and MongoDB on the backend.

## The Layout

Navigate by topic (listed below

buttons on top

![asdf](img/layout.png)


### Topics

The topics buttons will include:
* Gender
* Age
* Income
* Housing density/availability/cost
* Mortgages
* Poverty status
* Education levels
* Industries


## Step 1: Extracting Census Data

This step uses the Census Reporter API to interface with the data,
extract relevant tables and quantities, process it (compute any 
convenient, basic derived quantities).


## Step 2: JSON Storage and Access

This involes setting up the JSON to be in a MongoDB 
(alternatively, could dump the data to an Amazon S3 bucket).

In our previous Shrubbery projects, this step was 
simply cut out, and we skipped straight to making 
the D3 + Leaflet map. But this process is a bit 
different. Here, we're dealing with a much larger
dataset, and we are performing a more in-depth 
statistical analysis of the data.

We need flexibility: 
we need to be able to slice and dice the data,
crunch numbers in parallel, 
and expand the available data
to include these calculated quantities
(and/or orthogonal datasets 
that are not spatial in nature).


## Step 3: Analysis and Modeling

Once we have extracted the relevant data and have stored it in our database,
we can use it in some heavy-duty analysis scripts. 

We will start by writing these analysis scripts for a single metropolitan area,
and perfecting it for generating new data for the database (data which we will
plot with D3.js and Leaflet.js).

Next, we will parallelize the algorithm and turn it loose on the entire set of 
15 (or more) metropolitan areas.

## Step 4: Visualization

The last step is to incorporate the data and analysis results 
into a visualization that is interactive and that can be used
to explore the many dimensions of the dataset.

This step uses D3.js, Leaflet.js, and Angular.js to build a 
frontend user interface for visualizing data.








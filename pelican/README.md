# Adding a Map

This is a step-by-step for adding new maps to A Shrubbery.

The Leaflet map itself is Javascript, and goes in ```mymap.js```.
The (trivial) HTML page on which the map is embedded will 
be called ```mymap.html```.




# Pelican Layout 

Here's how I'm using Pelican.

## Pelican Content

First, my web content goes in ```content```. This contains
both blog posts and pages:

```
pelican/
    content/
        my-first-blog-post.md
        pages/
            about.md
```

This is mainly a static page, with most of the content 
on the pages. It is only secondarily a blog. For this reason,
I include the following line in all of the Markdown pages:

```
save_as: about.html
``` 

That way I can have finer tuned control over which pages 
go where, even if they're in Markdown and being rendered
automatically.

## Adding Template Pages

Another trick I use to facilitate the use of Pelican for 
static, non-blog web pages is to add template pages and 
extra template paths.

First, by specifying ```EXTRA_TEMPLATE_PATHS```, I can
put my templates in a more convenient directory than 
```my-theme/templates``` (and critically, somewhere 
independent of the theme, so we can still use templates
even if we're using a "canned" theme.)

For example, if I want to create content about maps,
I add a maps directory in my pelican folder,

```
pelican/
    cached/
    content/
    output/
    maps/
```

and add that to the template paths:

```
EXTRA_TEMPLATES_PATHS = ['maps']
```

Second, I can obtain even finer-grained control over
what templates are rendered and where they end up.
By setting the ```TEMPLATE_PAGES``` variable, I can 
control the list of files rendered, and specify 
where they end up.

The syntax is:

```
TEMPLATE_PAGES[ <template file> ] = <URL path>
```

So for example, to render the file ```nycstreets.html``` 
as a template, and make it available at 
```http://yoursite.com/nycstreets/```, you can say:

```
TEMPLATE_PAGES['nycstreets.html'] = 'nycstreets/index.html'
```




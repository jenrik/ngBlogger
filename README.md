# ngBlogger

ngBlogger is a blog system powered by Angular.js. It requires no server side processing other than the initial build process, which can be done before uploading the site. ngBlogger work by loading up pages in the form of JSON, then rendering a template on based on the loaded JSON. ngBlogger comes with build in support for markdown.

# Setup

Your create a new blog by cloning this repository and then configuring it in the `blogger.json` file.

# Creating pages

To create a new page you create a file any where in assets, with the extension .page.json and the following format:
```JSON
{
	"template": "", // The url to the template
	"content": ""   // The default option to specify the content of the page
}
```
You can specify extra options for the template, like the content option. Some templates might expect certain option to be specified.

# Building

To build your site you simple execute `grunt build` and then copy the content of the build folder to your website

# Development

When your developing you can execute `grunt dev` to start a development server and files will be continually rebuild as needed.

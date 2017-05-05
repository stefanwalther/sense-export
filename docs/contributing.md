Pull requests and stars are always welcome. For bugs and feature requests, [please create an issue]({%= bugs.url %}).
The process for contributing is outlined below:

1. Create a fork of the project
2. Work on whatever bug or feature you wish
3. Create a pull request (PR)

I cannot guarantee that I will merge all PRs but I will evaluate them all.


### Using the Project in Dev-Hub

The default build of ***sense-export*** minifies the JavaScript files and does not contain a [`wbfolder.wbl` file](http://qliksite.io/tutorials/qliksense-visualization-extensions/part-09/1002-Troubleshooting-FAQ/#what-is-a-wbl-file) (which is just necessary for Dev-Hub).

So if you want to edit the extension or create your own extension based on ***sense-export*** download the [./build/sense-export_dev.zip](https://github.com/stefanwalther/sense-export/raw/master/build/sense-export_dev.zip) file which always contains the latest version + a `wbfolder.wbl` file.

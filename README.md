# ga_extract


Extracts data from a Google Analytics property using the [Core Reporting API](https://developers.google.com/analytics/devguides/reporting/core/v3/).

It returns the data for all URLs matching the supplied search terms - uses the filter ga:pagePath=@xxxx.
(This is currently hard-coded in, but could be readily adapted to amend/remove filters - see src/GADataTransform.js)


### Instructions
1. Define search terms in input.csv
2. Set variables in index.js (from/to dates, metrics, dimensions, output file name)
3. Get an API key: temporary one available on running a query with the Query Explorer tool: https://ga-dev-tools.appspot.com/query-explorer/. Or see https://developers.google.com/analytics/devguides/reporting/core/v3/quickstart/service-java
4. Export your API key as an environment variable: GA_TOKEN
5. Run index.js in Node

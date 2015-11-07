# d3-request

A convenient alternative to XMLHttpRequest. For example, to load a text file:

```js
request("/path/to/file.txt", function(error, request) {
  if (error) return console.error(error.status);
  console.log(request.responseText); // Hello, world!
});
```

To load a CSV file:

```js
csv("/path/to/file.csv", function(error, data) {
  if (error) return console.error(error.status);
  console.log(data); // [{"Hello": "world"}, …]
});
```

To post some query parameters:

```js
request("/path/to/resource")
    .header("Content-Type", "application/x-www-form-urlencoded")
    .post("a=2&b=3", callback);
```

This module includes support for parsing [JSON](#json), [CSV](#csv) and [TSV](tsv) out of the box.

## Installing

If you use NPM, `npm install d3-request`. Otherwise, download the [latest release](https://github.com/d3/d3-request/releases/latest).

## API Reference

<a name="request" href="#request">#</a> <b>request</b>(<i>url</i>[, <i>callback</i>])

Returns a new asynchronous request for specified *url*. If no *callback* is specified, the request is not yet [sent](#request_send) and can be further configured. If a *callback* is specified, it is equivalent to calling [*request*.get](#request_get) immediately after construction:

```js
request(url).get(callback);
```

Note: if you wish to specify a request header or a mime type, you must *not* specify a callback to the constructor. Use [*request*.header](#request_header) or [*request*.mimeType](#request_mimeType) followed by [*request*.get](#request_get) instead.

<a name="request_header" href="#request_header">#</a> <i>request</i>.<b>header</b>(<i>name</i>[, <i>value</i>])

If *value* is specified, sets the request header with the specified *name* to the specified value and returns this request instance. If *value* is null, removes the request header with the specified *name* instead. If *value* is not specified, returns the current value of the request header with the specified *name*. Header names are case-insensitive.

Request headers can only be modified before the request is [sent](#request_send). Therefore, you cannot pass a callback to the [request constructor](#request) if you wish to specify a header; use [*request*.get](#request_get) or similar instead. For example:

```js
request(url).header("Accept-Language", "en-US").get(callback);
```

<a name="request_mimeType" href="#request_mimeType">#</a> <i>request</i>.<b>mimeType</b>([<i>type</i>])

If *type* is specified, sets the request mime type to the specified value and returns this request instance. If *type* is null, clears the current mime type (if any) instead. If *type* is not specified, returns the current mime type, which defaults to null. The mime type is used to both set the ["Accept" request header](http://www.w3.org/Protocols/rfc2616/rfc2616-sec14.html) and for [overrideMimeType](http://www.w3.org/TR/XMLHttpRequest/#the-overridemimetype%28%29-method), where supported.

The request mime type can only be modified before the request is [sent](#request_send). Therefore, you cannot pass a callback to the [request constructor](#request) if you wish to override the mime type; use [*request*.get](#request_get) or similar instead. For example:

```js
request(url).mimeType("text/csv").get(callback);
```

<a name="request_responseType" href="#request_responseType">#</a> <i>request</i>.<b>responseType</b>(<i>type</i>)

If *type* is specified, sets the [response type](http://www.w3.org/TR/XMLHttpRequest/#the-responsetype-attribute) attribute of the request and returns this request instance. Typical values are: `""`, `"arraybuffer"`, `"blob"`, `"document"`, and `"text"`. If *type* is not specified, returns the current response type, which defaults to `""`.

<a name="request_response" href="#request_response">#</a> <i>request</i>.<b>response</b>(<i>value</i>)

If *value* is specified, sets the response value function to the specified function and returns this request instance. If *value* is not specified, returns the current response value function, which defaults to the identity function.

The response value function is used to map the response XMLHttpRequest object to a useful data value. See the convenience methods [json](#json) and [text](#text) for examples.

<a name="request_get" href="#request_get">#</a> <i>request</i>.<b>get</b>([<i>callback</i>])

Equivalent to [*request*.send](#request_send) with the GET method:

```js
request.send("GET", callback);
```

<a name="request_post" href="#request_post">#</a> <i>request</i>.<b>post</b>([<i>data</i>][, <i>callback</i>])

Equivalent to [*request*.send](#request_send) with the POST method:

```js
request.send("POST", data, callback);
```

<a name="request_send" href="#request_send">#</a> <i>request</i>.<b>send</b>(<i>method</i>[, <i>data</i>][, <i>callback</i>])

Issues this request using the specified *method* (such as `"GET"` or `"POST"`), optionally posting the specified *data* in the request body, and returns this request instance. If a *callback* is specified, the callback will be invoked asynchronously when the request succeeds or fails. The callback is invoked with two arguments: the error, if any, and the [response value](#request_response). The response value is undefined if an error occurs. This is equivalent to:

```js
request
    .on("error", function(xhr) { callback(xhr); })
    .on("load", function(xhr) { callback(null, xhr); })
    .send(method);
```

If no *callback* is specified, then "load" and "error" listeners should be registered via [*request*.on](#request_on).

<a name="request_abort" href="#request_abort">#</a> <i>request</i>.<b>abort</b>()

Aborts this request, if it is currently in-flight, and returns this request instance. See [XMLHttpRequest’s abort](http://www.w3.org/TR/XMLHttpRequest/#the-abort%28%29-method).

<a name="request_on" href="#request_on">#</a> <i>request</i>.<b>on</b>(<i>type</i>[, <i>listener</i>])

If *listener* is specified, sets the event *listener* for the specified *type* and returns this request instance. If an event listener was already registered for the same type, the existing listener is removed before the new listener is added. If *listener* is null, removes the current event *listener* for the specified *type* (if any) instead. If *listener* is not specified, returns the currently-assigned listener for the specified type, if any.

The type must be one of the following:

* `"beforesend"` - to allow custom headers and the like to be set before the request is [sent](#request_send).
* `"progress"` - to monitor the [progress of the request](http://www.w3.org/TR/progress-events/).
* `"load"` - when the request completes successfully.
* `"error"` - when the request completes unsuccessfully; this includes 4xx and 5xx response codes.

To register multiple listeners for the same *type*, the type may be followed by an optional name, such as `"load.foo"` and `"load.bar"`. See [d3-dispatch](https://github.com/d3/d3-dispatch) for details.

<a name="csv" href="#csv">#</a> <b>csv</b>(<i>url</i>[, <i>row</i>][, <i>callback</i>])

Creates a request for the [CSV](https://github.com/d3/d3-dsv#csv) file at the specified *url* with the default mime type `"text/csv"`. An optional *row* conversion function may be specified to map and filter row objects to a more-specific representation; see [*dsv*.parse](https://github.com/d3/d3-dsv#dsv_parse) for details. For example:

```js
function row(d) {
  return {
    year: new Date(+d.Year, 0, 1), // convert "Year" column to Date
    make: d.Make,
    model: d.Model,
    length: +d.Length // convert "Length" column to number
  };
}
```

The *row* conversion function can be changed by calling *request*.row on the returned instance. For example, this:

```js
csv(url, row, callback);
```

Is equivalent to this:

```js
csv(url).row(row).get(callback);
```

This convenience constructor is approximately equivalent to:

```js
request(url)
    .mimeType("text/csv")
    .response(function(xhr) { return csv.parse(xhr.responseText, row); })
    .get(callback);
```

<a name="html" href="#html">#</a> <b>html</b>(<i>url</i>[, <i>callback</i>])

Creates a request for the HTML file at the specified *url* with the default mime type "text/html". The HTML file is returned as a [document fragment](https://developer.mozilla.org/en-US/docs/DOM/range.createContextualFragment).

This convenience constructor is approximately equivalent to:

```js
request(url)
    .mimeType("text/html")
    .response(function(xhr) { return document.createRange().createContextualFragment(xhr.responseText); })
    .get(callback);
```

<a name="json" href="#json">#</a> <b>json</b>(<i>url</i>[, <i>callback</i>])

Creates a request for the [JSON](http://json.org) file at the specified *url* with the default mime type `"application/json"`.

This convenience constructor is approximately equivalent to:

```js
request(url)
    .mimeType("application/json")
    .response(function(xhr) { return JSON.parse(xhr.responseText); })
    .get(callback);
```

<a name="text" href="#text">#</a> <b>text</b>(<i>url</i>[, <i>callback</i>])

Creates a request for the text file at the specified *url* with the default mime type `"text/plain"`.

This convenience constructor is approximately equivalent to:

```js
request(url)
    .mimeType("text/plain")
    .response(function(xhr) { return xhr.responseText; })
    .get(callback);
```

<a name="tsv" href="#tsv">#</a> <b>tsv</b>(<i>url</i>[, <i>row</i>][, <i>callback</i>])

Creates a request for the [TSV](https://github.com/d3/d3-dsv#tsv) file at the specified *url* with the default mime type `"text/tab-separated-values"`. An optional *row* conversion function may be specified to map and filter row objects to a more-specific representation; see [*dsv*.parse](https://github.com/d3/d3-dsv#dsv_parse) for details. For example:

```js
function row(d) {
  return {
    year: new Date(+d.Year, 0, 1), // convert "Year" column to Date
    make: d.Make,
    model: d.Model,
    length: +d.Length // convert "Length" column to number
  };
}
```

The *row* conversion function can be changed by calling *request*.row on the returned instance. For example, this:

```js
tsv(url, row, callback);
```

Is equivalent to this:

```js
tsv(url).row(row).get(callback);
```

This convenience constructor is approximately equivalent to:

```js
request(url)
    .mimeType("text/tab-separated-values")
    .response(function(xhr) { return tsv.parse(xhr.responseText, row); })
    .get(callback);
```

<a name="xml" href="#xml">#</a> <b>xml</b>(<i>url</i>[, <i>callback</i>])

Creates a request for the XML file at the specified *url* with the default mime type `"application/xml"`.

This convenience constructor is approximately equivalent to:

```js
request(url)
    .mimeType("application/xml")
    .response(function(xhr) { return xhr.responseXML; })
    .get(callback);
```

## Changes from D3 3.x:

* xhr has been renamed request.

* The [request constructor](#request) no longer accepts an optional mime type argument. Use [*request*.mimeType](#request_mimeType) instead.

* Any *progress* event listener is passed the event directly as the first argument, rather than setting the d3.event global.

# d3-xhr

A convenient alternative to XMLHttpRequest. For example, to load a text file:

```js
xhr("/path/to/file.txt", function(error, request) {
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
xhr("/path/to/resource")
    .header("Content-Type", "application/x-www-form-urlencoded")
    .post("a=2&b=3", callback);
```

This module includes support for parsing [JSON](#json), [CSV](#csv) and [TSV](tsv) out of the box.

Changes from D3 3.x:

* The [xhr constructor](#xhr) no longer accepts an optional mime type argument. Use [*xhr*.mimeType](#xhr_mimeType) instead.

* Any *progress* event listener is passed the event directly as the first argument, rather than setting the d3.event global.

<a name="xhr" href="#xhr">#</a> <b>xhr</b>(<i>url</i>[, <i>callback</i>])

Returns a new asynchronous request for specified *url*. If no *callback* is specified, the request is not yet [sent](#xhr_send) and can be further configured. If a *callback* is specified, it is equivalent to calling [*xhr*.get](#xhr_get) immediately after construction:

```js
xhr(url).get(callback);
```

Note: if you wish to specify a request header or a mime type, you must *not* specify a callback to the constructor. Use [*xhr*.header](#xhr_header) or [*xhr*.mimeType](#xhr_mimeType) followed by [*xhr*.get](#xhr_get) instead.

<a name="xhr_header" href="#xhr_header">#</a> <i>xhr</i>.<b>header</b>(<i>name</i>[, <i>value</i>])

If *value* is specified, sets the request header with the specified *name* to the specified value and returns this xhr instance. If *value* is null, removes the request header with the specified *name* instead. If *value* is not specified, returns the current value of the request header with the specified *name*. Header names are case-insensitive.

Request headers can only be modified before the request is [sent](#xhr_send). Therefore, you cannot pass a callback to the [xhr constructor](#xhr) if you wish to specify a header; use [*xhr*.get](#xhr_get) or similar instead. For example:

```js
xhr(url).header("Accept-Language", "en-US").get(callback);
```

<a name="xhr_mimeType" href="#xhr_mimeType">#</a> <i>xhr</i>.<b>mimeType</b>([<i>type</i>])

If *type* is specified, sets the request mime type to the specified value and returns this xhr instance. If *type* is null, clears the current mime type (if any) instead. If *type* is not specified, returns the current mime type, which defaults to null. The mime type is used to both set the ["Accept" request header](http://www.w3.org/Protocols/rfc2616/rfc2616-sec14.html) and for [overrideMimeType](http://www.w3.org/TR/XMLHttpRequest/#the-overridemimetype%28%29-method), where supported.

The request mime type can only be modified before the request is [sent](#xhr_send). Therefore, you cannot pass a callback to the [xhr constructor](#xhr) if you wish to override the mime type; use [*xhr*.get](#xhr_get) or similar instead. For example:

```js
xhr(url).mimeType("text/csv").get(callback);
```

<a name="xhr_responseType" href="#xhr_responseType">#</a> <i>xhr</i>.<b>responseType</b>(<i>type</i>)

If *type* is specified, sets the [response type](http://www.w3.org/TR/XMLHttpRequest/#the-responsetype-attribute) attribute of the request and returns this xhr instance. Typical values are: `""`, `"arraybuffer"`, `"blob"`, `"document"`, and `"text"`. If *type* is not specified, returns the current response type, which defaults to `""`.

<a name="xhr_response" href="#xhr_response">#</a> <i>xhr</i>.<b>response</b>(<i>value</i>)

If *value* is specified, sets the response value function to the specified function and returns this xhr instance. If *value* is not specified, returns the current response value function, which defaults to the identity function.

The response value function is used to map the response XMLHttpRequest object to a useful data value. See the convenience methods [json](#json) and [text](#text) for examples.

<a name="xhr_get" href="#xhr_get">#</a> <i>xhr</i>.<b>get</b>([<i>callback</i>])

Equivalent to [*xhr*.send](#xhr_send) with the GET method:

```js
xhr.send("GET", callback);
```

<a name="xhr_post" href="#xhr_post">#</a> <i>xhr</i>.<b>post</b>([<i>data</i>][, <i>callback</i>])

Equivalent to [*xhr*.send](#xhr_send) with the POST method:

```js
xhr.send("POST", data, callback);
```

<a name="xhr_send" href="#xhr_send">#</a> <i>xhr</i>.<b>send</b>(<i>method</i>[, <i>data</i>][, <i>callback</i>])

Issues this request using the specified *method* (such as `"GET"` or `"POST"`), optionally posting the specified *data* in the request body, and returns this xhr instance. If a *callback* is specified, the callback will be invoked asynchronously when the request succeeds or fails. The callback is invoked with two arguments: the error, if any, and the [response value](#xhr_response). The response value is undefined if an error occurs. This is equivalent to:

```js
xhr
    .on("error", function(request) { callback(request); })
    .on("load", function(request) { callback(null, request); })
    .send(method);
```

If no *callback* is specified, then "load" and "error" listeners should be registered via [*xhr*.on](#xhr_on).

<a name="xhr_abort" href="#xhr_abort">#</a> <i>xhr</i>.<b>abort</b>()

Aborts this request, if it is currently in-flight, and returns this xhr instance. See [XMLHttpRequest’s abort](http://www.w3.org/TR/XMLHttpRequest/#the-abort%28%29-method).

<a name="xhr_on" href="#xhr_on">#</a> <i>xhr</i>.<b>on</b>(<i>type</i>[, <i>listener</i>])

If *listener* is specified, sets the event *listener* for the specified *type* and returns this xhr instance. If an event listener was already registered for the same type, the existing listener is removed before the new listener is added. If *listener* is null, removes the current event *listener* for the specified *type* (if any) instead. If *listener* is not specified, returns the currently-assigned listener for the specified type, if any.

The type must be one of the following:

* `"beforesend"` - to allow custom headers and the like to be set before the request is [sent](#xhr_send).
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

The *row* conversion function can be changed by calling *xhr*.row on the returned instance. For example, this:

```js
csv(url, row, callback);
```

Is equivalent to this:

```js
csv(url).row(row).get(callback);
```

This convenience constructor is approximately equivalent to:

```js
xhr(url)
    .mimeType("text/csv")
    .response(function(request) { return csv.parse(request.responseText, row); })
    .get(callback);
```

<a name="html" href="#html">#</a> <b>html</b>(<i>url</i>[, <i>callback</i>])

Creates a request for the HTML file at the specified *url* with the default mime type "text/html". The HTML file is returned as a [document fragment](https://developer.mozilla.org/en-US/docs/DOM/range.createContextualFragment).

This convenience constructor is approximately equivalent to:

```js
xhr(url)
    .mimeType("text/html")
    .response(function(request) { return document.createRange().createContextualFragment(request.responseText); })
    .get(callback);
```

<a name="json" href="#json">#</a> <b>json</b>(<i>url</i>[, <i>callback</i>])

Creates a request for the [JSON](http://json.org) file at the specified *url* with the default mime type `"application/json"`.

This convenience constructor is approximately equivalent to:

```js
xhr(url)
    .mimeType("application/json")
    .response(function(request) { return JSON.parse(request.responseText); })
    .get(callback);
```

<a name="text" href="#text">#</a> <b>text</b>(<i>url</i>[, <i>callback</i>])

Creates a request for the text file at the specified *url* with the default mime type `"text/plain"`.

This convenience constructor is approximately equivalent to:

```js
xhr(url)
    .mimeType("text/plain")
    .response(function(request) { return request.responseText; })
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

The *row* conversion function can be changed by calling *xhr*.row on the returned instance. For example, this:

```js
tsv(url, row, callback);
```

Is equivalent to this:

```js
tsv(url).row(row).get(callback);
```

This convenience constructor is approximately equivalent to:

```js
xhr(url)
    .mimeType("text/tab-separated-values")
    .response(function(request) { return tsv.parse(request.responseText, row); })
    .get(callback);
```

<a name="xml" href="#xml">#</a> <b>xml</b>(<i>url</i>[, <i>callback</i>])

Creates a request for the XML file at the specified *url* with the default mime type `"application/xml"`.

This convenience constructor is approximately equivalent to:

```js
xhr(url)
    .mimeType("application/xml")
    .response(function(request) { return request.responseXML; })
    .get(callback);
```

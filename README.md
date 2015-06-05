# d3-xhr

A convenient alternative to XMLHttpRequest. For example, to load a text file:

```js
xhr("/path/to/file.txt", function(error, request) {
  if (error) return console.error(error.status);
  console.log(request.responseText);
});
```

Or, equivalently with method chaining:

```js
xhr("/path/to/file.txt")
    .on("error", function(request) { console.error(request.status); })
    .on("load", function(request) { console.log(request.responseText); })
    .send("GET");
```

To post some query parameters using URL encoding:

```js
xhr("/path/to/server")
    .header("Content-Type", "application/x-www-form-urlencoded")
    .post("a=2&b=3", callback);
```

Or, to post some query parameters using JSON encoding:

```js
xhr("/path/to/server")
    .header("Content-Type", "application/json")
    .post(JSON.stringify({a: 2, b: 3}), callback);
```

<a name="xhr" href="#xhr">#</a> <b>xhr</b>(<i>url</i>[, <i>mimeType</i>][, <i>callback</i>])

Returns a new asynchronous request for specified *url*. If no *callback* is specified, the request is not yet [sent](#send) and can be further configured. If a *callback* is specified, it is equivalent to calling [xhr.get](#get) immediately after construction:

```js
xhr(url).get(callback);
```

Note: if you wish to specify a request header, you must not specify a callback to the constructor, and instead use [xhr.header](#header) followed by [xhr.get](#get).

If a *mimeType* is specified, it is equivalent to calling [xhr.mimeType](#mimeType) immediately after construction, prior to calling [xhr.get](#get):

```js
xhr(url).mimeType(mimeType).get(callback);
```

<a name="header" href="#header">#</a> xhr.<b>header</b>(<i>name</i>[, <i>value</i>])

If *value* is specified, sets the request header with the specified *name* to the specified value. If *value* is null, removes the request header with the specified *name*.

If *value* is not specified, returns the current value of the request header with the specified *name*. Header names are case-insensitive.

Request headers can only be modified *before* the request is [sent](#send). Therefore, you cannot pass a callback to the [xhr constructor](#xhr) if you wish to specify a header; use [xhr.get](#get) or similar instead. For example:

```js
xhr("/path/to/file.csv")
    .header("Accept-Language", "en-US")
    .get(callback);
```

<a name="mimeType" href="#mimeType">#</a> xhr.<b>mimeType</b>([<i>type</i>])

If *type* is specified, sets the request mime type to the specified value. If *type* is null, clears the current mime type, if any. Request headers may only be modified before the request is [sent](#send).

If *type* is not specified, returns the current mime type, which defaults to null.

The mime type is used to both set the ["Accept" request header](http://www.w3.org/Protocols/rfc2616/rfc2616-sec14.html) and for [overrideMimeType](http://www.w3.org/TR/XMLHttpRequest/#the-overridemimetype%28%29-method), where supported.

<a name="responseType" href="#responseType">#</a> xhr.<b>responseType</b>(<i>type</i>)

If *type* is specified, sets the [response type](http://www.w3.org/TR/XMLHttpRequest/#the-responsetype-attribute) attribute of the request. Typical values are: `""`, `"arraybuffer"`, `"blob"`, `"document"`, and `"text"`.

If *type* is not specified, returns the current response type, which defaults to `""`.

<a name="response" href="#response">#</a> xhr.<b>response</b>(<i>value</i>)

If *value* is specified, sets the response value function to the specified function.

If *value* is not specified, returns the current response value function, which defaults to the identity function.

The response value function is used to map the response XMLHttpRequest object to a useful data value. For example, for text requests, you might use:

```js
function text(url, callback) {
  return xhr(url)
      .response(function(request) { return request.responseText; })
      .get(callback);
}
```

For JSON requests, you might use:

```js
function json(url, callback) {
  return xhr(url)
      .response(function(request) { return JSON.parse(request.responseText); })
      .get(callback);
}
```

<a name="get" href="#get">#</a> xhr.<b>get</b>([<i>data</i>][, <i>callback</i>])

Equivalent to [xhr.send](#send) with the GET method:

```js
xhr.send("GET", data, callback);
```

<a name="post" href="#post">#</a> xhr.<b>post</b>([<i>data</i>][, <i>callback</i>])

Equivalent to [xhr.send](#send) with the POST method:

```js
xhr.send("POST", data, callback);
```

<a name="send" href="#send">#</a> xhr.<b>send</b>(<i>method</i>[, <i>data</i>][, <i>callback</i>])

Issues this request using the specified *method* (such as `"GET"` or `"POST"`), optionally posting the specified *data* in the request body.

If a *callback* is specified, the callback will be invoked asynchronously when the request succeeds or fails. The callback is invoked with two arguments: the error, if any, and the [response value](#response). The response value is undefined if an error occurs. This is equivalent to:

```js
xhr
    .on("error", callback)
    .on("load", function(request) { callback(null, request); })
    .send(method);
```

If no *callback* is specified, then "load" and "error" listeners should be registered via [xhr.on](#on).

<a name="abort" href="#abort">#</a> xhr.<b>abort</b>()

Aborts this request, if it is currently in-flight. See [XMLHttpRequest’s abort](http://www.w3.org/TR/XMLHttpRequest/#the-abort%28%29-method).

<a name="on" href="#on">#</a> xhr.<b>on</b>(<i>type</i>[, <i>listener</i>])

Adds or removes an event *listener* to this request for the specified event *type*. The type must be one of the following:

* _beforesend_ - before the request is sent, to allow custom headers and the like to be set.
* _progress_ - to monitor the [progress of the request](http://www.w3.org/TR/progress-events/).
* _load_ - when the request completes successfully.
* _error_ - when the request completes unsuccessfully; this includes 4xx and 5xx response codes.

If an event listener was already registered for the same type, the existing listener is removed before the new listener is added. To register multiple listeners for the same event type, the type may be followed by an optional namespace, such as "load.foo" and "load.bar". To remove a listener, pass null as the listener. See [d3-dispatch](https://github.com/d3/d3-dispatch) for details.

If *listener* is not specified, returns the currently-assigned listener for the specified type, if any.

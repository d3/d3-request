var tape = require("tape"),
    xhr = require("../");

require("./XMLHttpRequest");

tape("xhr(url, callback) makes an asynchronous request with the default mime type", function(test) {
  xhr.xhr("test/data/sample.txt", function(error, request) {
    if (error) throw error;
    test.equal(request._info.url, "test/data/sample.txt");
    test.equal(request._info.async, true);
    test.equal(request.responseText, "Hello, world!\n");
    test.equal(request._info.mimeType, undefined);
    test.equal(request.readyState, 4);
    test.equal(request.status, 200);
    test.end();
  });
});

tape("xhr(url, callback) is an alias for xhr(url).get(callback)", function(test) {
  xhr.xhr("test/data/sample.txt").get(function(error, request) {
    if (error) throw error;
    test.equal(request._info.url, "test/data/sample.txt");
    test.equal(request._info.async, true);
    test.equal(request.responseText, "Hello, world!\n");
    test.equal(request._info.mimeType, undefined);
    test.equal(request.readyState, 4);
    test.equal(request.status, 200);
    test.end();
  });
});

tape("xhr(url, mimeType, callback) observes the specified mime type", function(test) {
  xhr.xhr("test/data/sample.txt", "text/plain", function(error, request) {
    if (error) throw error;
    test.equal(request._info.mimeType, "text/plain");
    test.equal(request.responseText, "Hello, world!\n");
    test.end();
  });
});

tape("xhr(url, mimeType, callback) is an alias for xhr(url).mimeType(mimeType).get(callback)", function(test) {
  xhr.xhr("test/data/sample.txt").mimeType("text/plain").get(function(error, request) {
    if (error) throw error;
    test.equal(request._info.mimeType, "text/plain");
    test.equal(request.responseText, "Hello, world!\n");
    test.end();
  });
});

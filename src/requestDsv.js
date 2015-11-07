import request from "./request";

export default function(defaultMimeType, dsv) {
  return function(url, row, callback) {
    if (arguments.length < 3) callback = row, row = null;
    var r = request(url).mimeType(defaultMimeType);
    r.row = function(_) { return arguments.length ? r.response(responseOf(dsv, row = _)) : row; };
    r.row(row);
    return callback ? r.get(callback) : r;
  };
};

function responseOf(dsv, row) {
  return function(request) {
    return dsv.parse(request.responseText, row);
  };
}

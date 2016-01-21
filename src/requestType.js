import request from "./request";

export default function(defaultMimeType, response) {
  return function(url, callback) {
    var r = request(url).mimeType(defaultMimeType).response(response);
    return callback ? r.get(callback) : r;
  };
}

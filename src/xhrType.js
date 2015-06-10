import xhr from "./xhr";

export default function(defaultMimeType, response) {
  return function(url, callback) {
    var r = xhr(url).mimeType(defaultMimeType).response(response);
    return callback ? r.get(callback) : r;
  };
};

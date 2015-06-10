import xhrType from "./xhrType";

export default xhrType("application/xml", function(request) {
  return request.responseXML;
});

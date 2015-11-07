import requestType from "./requestType";

export default requestType("application/xml", function(xhr) {
  return xhr.responseXML;
});

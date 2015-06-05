import {xhrType} from "./xhr";

export default xhrType("application/xml", function(request) {
  return request.responseXML;
});

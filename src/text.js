import {xhrType} from "./xhr";

export default xhrType("text/plain", function(request) {
  return request.responseText;
});

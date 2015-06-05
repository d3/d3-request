import {xhrType} from "./xhr";

export default xhrType("application/json", function(request) {
  return JSON.parse(request.responseText);
});

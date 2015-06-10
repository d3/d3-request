import xhrType from "./xhrType";

export default xhrType("text/plain", function(request) {
  return request.responseText;
});

import xhrType from "./xhrType";

export default xhrType("application/json", function(request) {
  return JSON.parse(request.responseText);
});

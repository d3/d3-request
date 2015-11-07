import requestType from "./requestType";

export default requestType("text/plain", function(xhr) {
  return xhr.responseText;
});

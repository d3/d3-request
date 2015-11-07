import requestType from "./requestType";

export default requestType("application/json", function(xhr) {
  return JSON.parse(xhr.responseText);
});

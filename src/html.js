import requestType from "./requestType";

export default requestType("text/html", function(xhr) {
  return document.createRange().createContextualFragment(xhr.responseText);
});

import {xhrType} from "./xhr";

export default xhrType("text/html", function(request) {
  return document.createRange().createContextualFragment(request.responseText);
});

import {tsv} from "d3-dsv";
import requestDsv from "./requestDsv";

export default requestDsv("text/tab-separated-values", tsv);

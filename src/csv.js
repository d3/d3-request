import {csv} from "d3-dsv";
import xhrDsv from "./xhrDsv";

export default xhrDsv("text/csv", csv);

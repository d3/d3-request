import {csv} from "d3-dsv";
import requestDsv from "./requestDsv";

export default requestDsv("text/csv", csv);

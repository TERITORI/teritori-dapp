import { weshClient } from "./client";
import { weshConfig } from "./config";
import * as weshServices from "./services";

weshServices.createConfig();

export { weshServices, weshClient, weshConfig };

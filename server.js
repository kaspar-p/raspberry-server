import "./config.js";
import _ from "lodash";
import express from "express";
import compression from "compression";
import bodyParser from "body-parser";

import Bulletin from "./lib/bulletin.js";
import createJobs from "./lib/jobs.js";
import routes from "./routes/routes.js";

const PORT = process.env.PORT || 1441;

const server = express();

// ---------------------
//     CONFIGURATION
// ---------------------
server.use(compression());
server.use(bodyParser.json({ limit: "50mb" }));
server.use(bodyParser.urlencoded({ extended: false }));

server.use(routes);

server.listen(PORT);

let jobs = createJobs();

const command = process.argv.join(" ");

const displayGUI = !command.includes("--headless") && !command.includes("-H");
process.env.HEADLESS = !displayGUI;
if (displayGUI) {
  const bulletin = new Bulletin(jobs, PORT);

  _.forEach(jobs, (job, name) => {
    job.giveParent(bulletin);
  });
  bulletin.initialize();
}

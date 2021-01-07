import "./config.js";
import _ from "lodash";

import Bulletin from "./lib/bulletin.js";
import createJobs from "./lib/jobs.js";

let jobs = createJobs();

if (displayGUI) {
  const bulletin = new Bulletin(jobs);
  const displayGUI = process.argv[3] === "true";

  _.forEach(jobs, (job, name) => {
    job.giveParent(bulletin);
  });
  bulletin.initialize();
}

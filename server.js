import "./config.js";
import _ from "lodash";

import Bulletin from "./lib/bulletin.js";
import createJobs from "./lib/jobs.js";

// Create the table

let jobs = createJobs();

const bulletin = new Bulletin(jobs);

_.forEach(jobs, (job, name) => {
  job.giveParent(bulletin);
});
bulletin.drawFirstTime();

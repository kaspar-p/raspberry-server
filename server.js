import "./config.js";
import _ from "lodash";

import Bulletin from "./lib/bulletin.js";
import jobs from "./lib/jobs.js";

// Create the table
const bulletin = new Bulletin(Object.keys(jobs));

// Give update capability with wrapping to each CRON job
_.forEach(jobs, (job, name) => {
  job((status) => bulletin.updateStatus(name, status));
});

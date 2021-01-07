import { exec } from "child_process";
import path from "path";
import _ from "lodash";

import Job from "./Job.js";
import { textMe } from "./text-me.js";
import { logError } from "./log.js";

const jobs = {
  "topo-backpack": new Job("topo-backpack", "*/10 * * * * *", () => {
    const topoPath = path.join(process.env.PWD, "topo.py");

    exec(`python ${topoPath}`, (error, stdout, stderr) => {
      if (stderr || error) {
        console.log(stderr, error);
        logError(stderr);
        logError(error);
        return true;
      }

      if (stdout === "AVAILABLE\n") {
        textMe("The TOPO backpack 'Rover Pack - Classic' is available!");
      }
    });
  }),
};

const cancelledJobs = ["topo-backpack"];

const createJobs = () => {
  _.forEach(jobs, (job, name) => {
    if (cancelledJobs.includes(name)) {
      job.cancel();
    }
  });

  return jobs;
};
export default createJobs;

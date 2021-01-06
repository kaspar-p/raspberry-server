import { exec } from "child_process";
import path from "path";
import _ from "lodash";

import Job from "./Job.js";
import { textMe } from "./text-me.js";

const jobs = {
  "topo-backpack": new Job("topo-backpack", "0 30 * * * *", () => {
    const topoPath = path.join(process.env.PWD, "topo.py");

    exec(`python ${topoPath}`, (error, stdout, stderr) => {
      if (stderr || error) {
        console.log(stderr, error);
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
  let filteredArr = _.filter(
    jobs,
    (job, name) => !cancelledJobs.includes(name)
  );
  let filteredObj = {};
  filteredArr.forEach((job) => (filteredObj[job.name] = job));
  return filteredObj;
};
export default createJobs;

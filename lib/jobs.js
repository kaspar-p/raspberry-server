import scheduler from "node-schedule";
import { exec } from "child_process";
import path from "path";

import { textMe } from "./text-me.js";

export default {
  "topo-backpack": (updateStatus) =>
    scheduler.scheduleJob("* 30 * * * *", () => {
      updateStatus("running");

      const topoPath = path.join(process.env.PWD, "topo.py");
      const topoOptions = `--name="rover pack - classic"`;

      exec(`python ${topoPath} ${topoOptions}`, (error, stdout, stderr) => {
        if (stderr || error) {
          console.log(stderr, error);
          return updateStatus("red");
        }

        if (stdout === "AVAILABLE\n") {
          textMe("The TOPO backpack 'Rover Pack - Classic' is available!");
        }
      });

      // Make it be "running" for a little bit - just for stylistic purposes
      setTimeout(() => {
        updateStatus("green");
      }, 5000);
    }),
};

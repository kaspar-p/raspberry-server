const scheduler = require("node-schedule");
const { exec } = require("child_process");
const path = require("path");
require("dotenv").config();

const { textMe } = require("./text-me");

console.log("Starting server!");

// Once every hour, at the 30 minute mark
const topoBackpackJob = scheduler.scheduleJob("30 */30 * * * *", () => {
  const topoPath = path.resolve(__dirname, "../sniper-bot/topo.py");
  const topoOptions = `--name="rover pack - classic"`;

  console.log("Begin checking TOPO availability:");
  exec(`python ${topoPath} ${topoOptions}`, (error, stdout, stderr) => {
    if (error) return console.log(error);

    if (stdout === "AVAILABLE\n") {
      textMe(
        "The Topo Designs 'Rover Pack - Classic' is available for purchase!"
      );
    } else if (stdout === "UNAVAILABLE\n") {
      console.log(
        "Backpack still unavailable",
        new Date().toLocaleTimeString() +
          " on " +
          new Date().toLocaleDateString()
      );
    }
  });
});

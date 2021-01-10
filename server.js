import "./config.js";
import _ from "lodash";
import express from "express";
import compression from "compression";
import bodyParser from "body-parser";
import Campi from "campi";
import base64 from "base64-stream";
import * as socketIO from "socket.io";

import Bulletin from "./lib/bulletin.js";
import createJobs from "./lib/jobs.js";
import routeBuilder from "./routes/routes.js";

const PORT = process.env.PORT || 1441;

const app = express();
const campi = new Campi();

// ---------------------
//     CONFIGURATION
// ---------------------
app.use(compression());
app.use(bodyParser.json({ limit: "50mb" }));
app.use(bodyParser.urlencoded({ extended: false }));

const server = app.listen(PORT);

const io = new socketIO.Server(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
  },
});

io.on("connection", (socket) => {
  const routes = routeBuilder(io);
  app.use("/api", routes);

  console.log("Hello, new user: ", socket.id);
});

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

let busy = false;
// Begin the camera operations
setInterval(() => {
  if (!busy) {
    busy = true;
    campi.getImageAsStream(
      {
        width: 1280,
        height: 960,
        shutter: 200000,
        timeout: 1,
        nopreview: true,
      },
      function (err, stream) {
        let message = "";

        const base64Stream = stream.pipe(base64.encode());

        base64Stream.on("data", function (buffer) {
          message += buffer.toString();
        });

        base64Stream.on("end", function () {
          io.sockets.emit("display-image", message);
          busy = false;
        });
      }
    );
  }
}, 100);

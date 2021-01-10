import "./config.js";
import _ from "lodash";
import express from "express";
import * as fs from "fs";
import compression from "compression";
import bodyParser from "body-parser";
import raspividStream from "raspivid-stream";
import { StreamCamera, Codec } from "pi-camera-connect";
import expressWSInitializer from "express-ws";
import * as socketIO from "socket.io";

import Bulletin from "./lib/bulletin.js";
import createJobs from "./lib/jobs.js";
import routeBuilder from "./routes/routes.js";

const PORT = process.env.PORT || 1441;

const app = express();
const expressWS = expressWSInitializer(app);

// ---------------------
//     CONFIGURATION
// ---------------------
app.use(compression());
app.use(bodyParser.json({ limit: "50mb" }));
app.use(bodyParser.urlencoded({ extended: false }));

const server = app.listen(PORT);

const io = new socketIO.Server(server, {
  cors: {
    origin: "http://10.0.0.216:3000",
    methods: ["GET", "POST"],
  },
});

const width = 1280;
const height = 960;

app.ws("/video", async (ws, req) => {
  ws.send(
    JSON.stringify({
      action: "init",
      width,
      height,
    })
  );

  const videoStream = raspividStream();
  // const streamCamera = new StreamCamera({ codec: Codec.H264 });
  // const videoStream = streamCamera.createStream();

  videoStream.on("data", (data) => {
    ws.send(data, { binary: true }, (error) => {
      if (error) console.error(error);
    });
  });

  await streamCamera.startCapture();
});

// const video = raspividStream({ width, height, framerate: 20 });
// video.on("data", (data) => {
//   io.sockets.emit("display-image", {
//     imageWidth: width,
//     imageHeight: height,
//     imageData: data,
//   });
// });

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

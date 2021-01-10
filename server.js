import "./config.js";
import _ from "lodash";
import express from "express";
import compression from "compression";
import bodyParser from "body-parser";
import Campi from "campi";
import raspivid from "raspivid";
import * as Base64Encode from "base64-stream";
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
    origin: "http://10.0.0.216:3000",
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

const width = 1280;
const height = 960;

const video = raspivid({ width, height, fps: 20 });
video.on("data", (data) => {
  io.sockets.emit("display-image", {
    imageWidth: width,
    imageHeight: height,
    imageStream: video,
  });
});

// // Begin the camera operations
// setInterval(() => {
//   if (!busy) {
//     busy = true;
//     campi.getImageAsStream(
//       {
//         width,
//         height,
//         shutter: 200000,
//         timeout: 1,
//         nopreview: true,
//       },
//       (err, stream) => {
//         let message = "";

//         const base64Stream = stream.pipe(new Base64Encode());

//         base64Stream.on("data", (buffer) => {
//           message += buffer.toString();
//         });

//         base64Stream.on("end", () => {
//           io.sockets.emit("display-image", {
//             imageWidth: width,
//             imageHeight: height,
//             imageData: message,
//           });
//           busy = false;
//         });
//       }
//     );
//   }
// }, 50);

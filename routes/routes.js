import express from "express";
const router = express.Router();

const routeBuilder = (socket) => {
  router.post("/video", (req, res) => {
    console.log("Getting Video!");
    socket.emit("display-image", req.body);
    res.end();
  });

  return router;
};

export default routeBuilder;

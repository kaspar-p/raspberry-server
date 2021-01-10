import express from "express";

const router = express.Router();

router.post("/video", (req, res) => {
  console.log("Getting Video!");
  console.log("\n", req, "\n");
  console.log("\n", res, "\n");
});

export default router;

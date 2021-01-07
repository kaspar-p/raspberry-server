import fs from "fs";
import path from "path";

const logPath = path.join(process.env.PWD, "logs/", "log.txt");
export const logError = (message) => {
  fs.appendFile(logPath, message);
};

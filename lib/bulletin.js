import chalk from "chalk";
import _ from "lodash";

export default class Bulletin {
  constructor(jobs) {
    this.jobs = jobs;
  }

  initialize() {
    this.numJobs = Object.keys(this.jobs).length;
    this.maxDateLength = 19;

    if (this.numJobs === 0) {
      this.headers = [
        this.padEvenly("JOB NAME"),
        this.padEvenly("STATUS "),
        this.padEvenly("LAST RUN", this.maxDateLength),
      ];
    } else {
      const longestNameLength = Object.keys(this.jobs)
        .sort((a, b) => a.length - b.length)
        .pop().length;

      this.headers = [
        this.padEvenly("JOB NAME", longestNameLength),
        this.padEvenly("STATUS "),
        this.padEvenly("LAST RUN", this.maxDateLength),
      ];
    }

    this.minTableRows = 5;
    this.fakeTableRows = Math.max(0, this.minTableRows - this.numJobs);
    this.numRows = Math.max(this.minTableRows, this.numJobs);

    this.draw(true);
  }

  formatDate(date) {
    if (typeof date !== "object") {
      return date;
    }

    const day = ("0" + date.getDate()).slice(-2);
    const month = ("0" + (date.getMonth() + 1)).slice(-2);
    const fullDate = `${day}/${month}/${date.getFullYear()}`;

    const time = date.toTimeString().slice(0, 5);

    return `${fullDate} AT ${time}`;
  }

  getColor(status) {
    if (status === "running" || status === "N / A") return chalk.yellow;
    if (status === "green") return chalk.green;
    if (status === "red" || status === "halted") return chalk.red;
  }

  write(message) {
    const maxWidth = process.stdout.columns - 45;

    process.stdout.write(this.times(" ", maxWidth / 2) + message);
  }

  times(char, num) {
    let s = "";
    _.times(num, () => {
      s += char;
    });
    return s;
  }

  padEvenly(message, maxLength) {
    let front = this.times(" ", Math.floor((maxLength - message.length) / 2));
    let back = this.times(" ", Math.ceil((maxLength - message.length) / 2));

    return front + message + back;
  }

  drawWelcomeMessage(headerWidth) {
    this.write("\n");
    this.drawLine("\u250C", "\u2500", "\u2510");
    this.write(
      "\u2502" +
        this.padEvenly(
          "Welcome to Kaspar's Raspberry Server",
          headerWidth - 2
        ) +
        "\u2502\n"
    );
    this.drawLine("\u2514", "\u2500", "\u2518");
  }

  drawLine(beginSymbol, midSymbol, endSymbol) {
    let line = (index) => this.times("\u2500", this.headers[index].length + 2);

    this.write(
      `${beginSymbol}${line(0)}${midSymbol}${line(1)}${midSymbol}${line(
        2
      )}${endSymbol}\n`
    );
  }

  drawRow(name, status, lastRun, order) {
    // Body line
    this.write(`\u2502 ${name} \u2502 ${status} \u2502 ${lastRun} \u2502\n`);

    // Separator line
    let beginSymbol = order === this.numRows - 1 ? "\u2514" : "\u251C";
    let midSymbol = order === this.numRows - 1 ? "\u2534" : "\u253C";
    let endSymbol = order === this.numRows - 1 ? "\u2518" : "\u2524";

    this.drawLine(beginSymbol, midSymbol, endSymbol);
  }

  draw(isFirstTime) {
    const bulletinHeight = this.numRows * 2 + 3;
    const headerWidth = this.headers.join(" \u2396 ").length + 4;

    if (isFirstTime) {
      this.drawWelcomeMessage(headerWidth);
    } else {
      process.stdout.cursorTo(0);
      process.stdout.moveCursor(0, -bulletinHeight);
      process.stdout.clearScreenDown();
    }

    // Top line
    this.drawLine("\u250C", "\u252C", "\u2510");
    // Header line
    this.write(`\u2502 ${this.headers.join(" \u2502 ")} \u2502\n`);
    // Header and body separator
    this.drawLine("\u251C", "\u253C", "\u2524");

    // Fill in rows for the real jobs
    _.forEach(this.jobs, (job, name) => {
      const order = Object.keys(this.jobs).indexOf(name);
      const color = this.getColor(job.status);
      const padName = this.padEvenly(name, this.headers[0].length);
      const status = color(this.padEvenly(job.status, 7));
      const lastRun = this.padEvenly(
        this.formatDate(job.lastRun),
        this.maxDateLength
      );

      this.drawRow(padName, status, lastRun, order);
    });

    // Fill in the rows if there aren't enough jobs
    _.times(this.fakeTableRows, (n) => {
      const padName = this.padEvenly(" ", this.headers[0].length);
      const status = this.padEvenly(" ", 7);
      const lastRun = this.padEvenly(" ", this.maxDateLength);

      this.drawRow(padName, status, lastRun, n + this.numJobs);
    });
  }
}

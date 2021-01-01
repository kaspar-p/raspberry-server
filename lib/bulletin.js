import chalk from "chalk";
import _ from "lodash";

export default class Bulletin {
  constructor(tasks) {
    this.tasks = {};
    _.forEach(tasks, (name) => {
      this.tasks[name] = {
        status: "N / A",
        lastRun: "N / A",
      };
    });

    this.draw(true);
  }

  updateStatus(taskName, status) {
    if (this.tasks[taskName].status === "running" && status !== "running") {
      this.tasks[taskName].lastRun = this.formatDate(new Date());
    }

    this.tasks[taskName].status = status;
    this.draw();
  }

  formatDate(date) {
    const day = ("0" + date.getDate()).slice(-2);
    const month = ("0" + (date.getMonth() + 1)).slice(-2);
    const fullDate = `${day}/${month}/${date.getFullYear()}`;

    const time = date.toTimeString().slice(0, 5);

    return `${fullDate} AT ${time}`;
  }

  getColor(status) {
    if (status === "running" || status === "N / A") return chalk.yellow;
    return chalk[status];
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

  draw(isFirstTime) {
    const maxDateLength = 19;

    const longestName = Object.keys(this.tasks)
      .sort((a, b) => a.length - b.length)
      .pop().length;

    const headers = [
      this.padEvenly("TASK NAME", longestName),
      this.padEvenly("STATUS "),
      this.padEvenly("LAST RUN", maxDateLength),
    ];

    const bulletinHeight = Object.keys(this.tasks).length + 4;
    const headerWidth = headers.join(" \u2396 ").length + 4;

    if (isFirstTime) {
      this.write("\n");
      this.write("\u250C" + this.times("\u2500", headerWidth - 2) + "\u2510\n");
      this.write(
        "\u2502" +
          this.padEvenly(
            "Welcome to Kaspar's Raspberry Server",
            headerWidth - 2
          ) +
          "\u2502\n"
      );
      this.write(`\u2514${this.times("\u2500", headerWidth - 2)}\u2518\n`);
      // this.write("\n");
    }

    process.stdout.clearScreenDown();

    // Top line
    this.write(
      `\u250C${this.times("\u2500", headers[0].length + 2)}\u252C${this.times(
        "\u2500",
        headers[1].length + 2
      )}\u252C${this.times("\u2500", headers[2].length + 2)}\u2510\n`
    );
    // Header line
    this.write(`\u2502 ${headers.join(" \u2502 ")} \u2502\n`);
    // Header and body separator
    this.write(
      `\u251C${this.times("\u2500", headers[0].length + 2)}\u253C${this.times(
        "\u2500",
        headers[1].length + 2
      )}\u253C${this.times("\u2500", headers[2].length + 2)}\u2524\n`
    );

    _.forEach(this.tasks, (task, name) => {
      const color = this.getColor(task.status);
      const padName = this.padEvenly(name, headers[0].length);
      const status = color(this.padEvenly(task.status, 7));
      const lastRun = this.padEvenly(task.lastRun, maxDateLength);

      // Body lines
      this.write(
        `\u2502 ${padName} \u2502 ${status} \u2502 ${lastRun} \u2502\n`
      );
    });

    // End line
    this.write(
      `\u2514${this.times("\u2500", headers[0].length + 2)}\u2534${this.times(
        "\u2500",
        headers[1].length + 2
      )}\u2534${this.times("\u2500", headers[2].length + 2)}\u2518\n`
    );

    process.stdout.moveCursor(0, -bulletinHeight);
    process.stdout.cursorTo(0);
  }
}

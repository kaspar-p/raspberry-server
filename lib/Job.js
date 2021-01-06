import scheduler from "node-schedule";

class Job {
  constructor(name, cronSchedule, action) {
    this.status = "N / A";
    this.lastRun = "N / A";
    this.name = name;
    this.action = action;

    scheduler.scheduleJob(cronSchedule, () => this.runJob());
  }

  giveParent(bulletin) {
    this.bulletin = bulletin;
  }

  setRunning() {
    this.status = "running";
    this.lastRun = new Date();
  }

  setGreen() {
    this.status = "green";
  }

  setRed() {
    this.status = "red";
  }

  runJob() {
    this.setRunning();
    this.bulletin.draw();

    const didError = this.action();

    setTimeout(() => {
      if (didError) {
        this.setRed();
      } else {
        this.setGreen();
      }

      this.bulletin.draw();
    }, 5000);
  }
}

export default Job;

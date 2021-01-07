import scheduler from "node-schedule";

class Job {
  constructor(name, cronSchedule, action) {
    this.cronSchedule = cronSchedule;
    this.status = "N / A";
    this.lastRun = "N / A";
    this.name = name;
    this.action = action;

    this.job = scheduler.scheduleJob(this.cronSchedule, () => this.runJob());
  }

  giveParent(bulletin) {
    this.bulletin = bulletin;
  }

  cancel() {
    this.job.cancel();
    this.status = "halted";
  }

  restart() {
    this.job.schedule(this.cronSchedule);
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

  draw() {
    if (this.bulletin) this.bulletin.draw();
  }

  runJob() {
    this.setRunning();
    this.draw();

    const didError = this.action();

    setTimeout(() => {
      if (didError) {
        this.setRed();
      } else {
        this.setGreen();
      }

      this.draw();
    }, 5000);
  }
}

export default Job;

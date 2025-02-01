import cliSpinners from 'cli-spinners';
import logUpdate from 'log-update';
import pc from 'picocolors';
import { logger } from '../shared/logger.js';

class Spinner {
  private spinner = cliSpinners.dots;
  private message: string;
  private currentFrame = 0;
  private interval: ReturnType<typeof setInterval> | null = null;
  private isEnabled: boolean;

  constructor(message: string) {
    this.message = message;
    this.isEnabled = !logger.isVerboseEnabled();
  }

  start(): void {
    if (!this.isEnabled) {
      return;
    }

    const frames = this.spinner.frames;
    const framesLength = frames.length;
    this.interval = setInterval(() => {
      this.currentFrame++;
      const frame = frames[this.currentFrame % framesLength];
      logUpdate(`${pc.cyan(frame)} ${this.message}`);
    }, this.spinner.interval);
  }

  update(message: string): void {
    if (!this.isEnabled) {
      return;
    }

    this.message = message;
  }

  stop(finalMessage: string): void {
    if (this.interval) {
      clearInterval(this.interval);
      this.interval = null;
    }
    logUpdate(finalMessage);
    logUpdate.done();
  }

  succeed(message: string): void {
    this.stop(`${pc.green('✔')} ${message}`);
  }

  fail(message: string): void {
    this.stop(`${pc.red('✖')} ${message}`);
  }
}

export default Spinner;

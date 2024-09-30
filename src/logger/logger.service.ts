import { 
	Injectable, 
	Logger 
} from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class LoggerService extends Logger {
  private logFilePath: string;

  constructor() {
    super();

    this.logFilePath = path.join(__dirname, '..', '../logs', 'app.log');

    this.createLogDirectory();
  }

  private createLogDirectory() {
    const dir = path.dirname(this.logFilePath);

    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
  }

  log(message: string, context?: string): void {
    super.log(message, context);

    this.writeLogToFile('LOG', message, context);
  }

  error(message: string, trace: string, context?: string): void {
    super.error(message, trace, context);

    this.writeLogToFile('ERROR', `${message} - ${trace}`, context);
  }

  warn(message: string, context?: string): void {
    super.warn(message, context);

    this.writeLogToFile('WARN', message, context);
  }

  debug(message: string, context?: string): void {
    super.debug(message, context);

    this.writeLogToFile('DEBUG', message, context);
  }

  verbose(message: string, context?: string): void {
    super.verbose(message, context);

    this.writeLogToFile('VERBOSE', message, context);
  }

  private writeLogToFile(logLevel: string, message: string, context?: string): void {
    const logMessage = `${new Date().toISOString()} [${logLevel}] [${context || 'Application'}] ${message}\n`;

    fs.appendFileSync(this.logFilePath, logMessage);
  }
}
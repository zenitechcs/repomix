import { z } from 'zod';
import { logger, repomixLogLevels } from './logger.js';

export class RepomixError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'RepomixError';
  }
}

export class RepomixConfigValidationError extends RepomixError {
  constructor(message: string) {
    super(message);
    this.name = 'RepomixConfigValidationError';
  }
}

export const handleError = (error: unknown): void => {
  if (error instanceof RepomixError) {
    logger.error(`Error: ${error.message}`);
    logger.debug('Stack trace:', error.stack);
  } else if (error instanceof Error) {
    logger.error(`Unexpected error: ${error.message}`);
    // Show stack trace for unexpected errors
    logger.note('Stack trace:', error.stack);
    if (logger.getLogLevel() < repomixLogLevels.DEBUG) {
      logger.info('Please run with --verbose to see more details');
    }
  } else {
    logger.error('An unknown error occurred');
    if (logger.getLogLevel() < repomixLogLevels.DEBUG) {
      logger.info('Please run with --verbose to see more details');
    }
  }

  logger.log('');
  logger.info('For more help, please visit: https://github.com/yamadashy/repomix/issues');
};

export const rethrowValidationErrorIfZodError = (error: unknown, message: string): void => {
  if (error instanceof z.ZodError) {
    const zodErrorText = error.errors.map((err) => `[${err.path.join('.')}] ${err.message}`).join('\n  ');
    throw new RepomixConfigValidationError(
      `${message}\n\n  ${zodErrorText}\n\n  Please check the config file and try again.`,
    );
  }
};

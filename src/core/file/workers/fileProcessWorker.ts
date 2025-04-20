import type { RepomixConfigMerged } from '../../../config/configSchema.js';
import { logger, setLogLevelByEnv } from '../../../shared/logger.js';
import { processContent } from '../fileProcessContent.js';
import type { ProcessedFile, RawFile } from '../fileTypes.js';

export interface FileProcessTask {
  rawFile: RawFile;
  config: RepomixConfigMerged;
}

export default async ({ rawFile, config }: FileProcessTask): Promise<ProcessedFile> => {
  const processedContent = await processContent(rawFile, config);
  return {
    path: rawFile.path,
    content: processedContent,
  };
};

// Set logger log level from environment variable if provided
setLogLevelByEnv();

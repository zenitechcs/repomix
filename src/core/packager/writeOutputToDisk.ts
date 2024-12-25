import path from "path";
import fs from "node:fs/promises";
import { RepomixConfigMerged } from "../../config/configSchema.js";
import { logger } from "../../shared/logger.js";

export const writeOutputToDisk = async (
  output: string,
  config: RepomixConfigMerged
): Promise<undefined> => {
  const outputPath = path.resolve(config.cwd, config.output.filePath);
  logger.trace(`Writing output to: ${outputPath}`);
  await fs.writeFile(outputPath, output);
};

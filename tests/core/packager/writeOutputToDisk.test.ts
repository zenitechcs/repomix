import { describe, it, expect, vi } from "vitest";
import path from "path";
import fs from "node:fs/promises";
import { type RepomixConfigMerged } from "../../../src/config/configSchema.js";
import { writeOutputToDisk } from "../../../src/core/packager/writeOutputToDisk.js";

vi.mock("node:fs/promises");
vi.mock("../../shared/logger");

describe("writeOutputToDisk", () => {
  it("should write output to the specified file path", async () => {
    const output = "test output";
    const config: RepomixConfigMerged = {
      cwd: "/test/directory",
      output: { filePath: "output.txt" },
    } as RepomixConfigMerged;

    const outputPath = path.resolve(config.cwd, config.output.filePath);

    await writeOutputToDisk(output, config);

    expect(fs.writeFile).toHaveBeenCalledWith(outputPath, output);
  });
});

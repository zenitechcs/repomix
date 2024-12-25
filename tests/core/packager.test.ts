import * as fs from "node:fs/promises";
import path from "node:path";
import clipboardy from "clipboardy";
import { beforeEach, describe, expect, test, vi } from "vitest";
import type { collectFiles } from "../../src/core/file/fileCollect.js";
import type { processFiles } from "../../src/core/file/fileProcess.js";
import type { searchFiles } from "../../src/core/file/fileSearch.js";
import type { generateOutput } from "../../src/core/output/outputGenerate.js";
import { pack } from "../../src/core/packager.js";
import { TokenCounter } from "../../src/core/tokenCount/tokenCount.js";
import { createMockConfig } from "../testing/testUtils.js";
import { validateFileSafety } from "../../src/core/security/validateFileSafety.js";
import { writeOutputToDisk } from "../../src/core/packager/writeOutputToDisk.js";

vi.mock("node:fs/promises");
vi.mock("fs/promises");
vi.mock("../../src/core/tokenCount/tokenCount");
vi.mock("clipboardy", () => ({
  default: {
    write: vi.fn(),
  },
}));

describe("packager", () => {
  let mockDeps: {
    searchFiles: typeof searchFiles;
    collectFiles: typeof collectFiles;
    processFiles: typeof processFiles;
    validateFileSafety: typeof validateFileSafety;
    generateOutput: typeof generateOutput;
    writeOutputToDisk: typeof writeOutputToDisk;
  };

  beforeEach(() => {
    vi.resetAllMocks();
    const file2Path = path.join("dir1", "file2.txt");
    mockDeps = {
      searchFiles: vi.fn().mockResolvedValue({
        filePaths: ["file1.txt", file2Path],
        emptyDirPaths: [],
      }),
      collectFiles: vi.fn().mockResolvedValue([
        { path: "file1.txt", content: "raw content 1" },
        { path: file2Path, content: "raw content 2" },
      ]),
      processFiles: vi.fn().mockReturnValue([
        { path: "file1.txt", content: "processed content 1" },
        { path: file2Path, content: "processed content 2" },
      ]),
      validateFileSafety: vi.fn().mockResolvedValue({
        safeFilePaths: ["file1.txt", file2Path],
        safeRawFiles: [
          { path: "file1.txt", content: "safed content 1" },
          { path: file2Path, content: "safed content 2" },
        ],
        suspiciousFileResults: [],
      }),
      generateOutput: vi.fn().mockResolvedValue("mock output"),
      writeOutputToDisk: vi.fn().mockResolvedValue(undefined),
    };

    vi.mocked(TokenCounter.prototype.countTokens).mockReturnValue(10);
  });

  test("pack should process files and generate output", async () => {
    const mockConfig = createMockConfig();
    const progressCallback = vi.fn();
    const result = await pack("root", mockConfig, progressCallback, mockDeps);

    const file2Path = path.join("dir1", "file2.txt");

    expect(mockDeps.searchFiles).toHaveBeenCalledWith("root", mockConfig);
    expect(mockDeps.collectFiles).toHaveBeenCalledWith(
      ["file1.txt", file2Path],
      "root"
    );
    expect(mockDeps.validateFileSafety).toHaveBeenCalled();
    expect(mockDeps.processFiles).toHaveBeenCalled();
    expect(mockDeps.writeOutputToDisk).toHaveBeenCalled();
    expect(mockDeps.generateOutput).toHaveBeenCalled();

    expect(mockDeps.validateFileSafety).toHaveBeenCalledWith(
      [
        expect.objectContaining({
          content: "raw content 1",
          path: "file1.txt",
        }),
        expect.objectContaining({
          content: "raw content 2",
          path: file2Path,
        }),
      ],
      progressCallback,
      mockConfig
    );
    expect(mockDeps.processFiles).toHaveBeenCalledWith(
      [
        expect.objectContaining({
          content: "safed content 1",
          path: "file1.txt",
        }),
        expect.objectContaining({
          content: "safed content 2",
          path: file2Path,
        }),
      ],
      mockConfig
    );
    expect(mockDeps.writeOutputToDisk).toHaveBeenCalledWith(
      "mock output",
      mockConfig
    );
    expect(mockDeps.generateOutput).toHaveBeenCalledWith(
      "root",
      mockConfig,
      [
        expect.objectContaining({
          content: "processed content 1",
          path: "file1.txt",
        }),
        expect.objectContaining({
          content: "processed content 2",
          path: file2Path,
        }),
      ],
      ["file1.txt", file2Path]
    );

    // Check the result of pack function
    expect(result.totalFiles).toBe(2);
    expect(result.totalCharacters).toBe(11);
    expect(result.totalTokens).toBe(10);
    expect(result.fileCharCounts).toEqual({
      "file1.txt": 19,
      [file2Path]: 19,
    });
    expect(result.fileTokenCounts).toEqual({
      "file1.txt": 10,
      [file2Path]: 10,
    });
  });

  test("pack should copy to clipboard when enabled", async () => {
    const mockConfig = createMockConfig({
      output: {
        copyToClipboard: true,
      },
    });

    await pack("root", mockConfig, () => {}, mockDeps);
    expect(clipboardy.write).toHaveBeenCalled();
  });
});

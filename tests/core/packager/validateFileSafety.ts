import { describe, it, beforeEach, expect, vi } from "vitest";
import { RawFile } from "../../../src/core/file/fileTypes.js";
import { SuspiciousFileResult } from "../../../src/core/security/securityCheck.js";
import { validateFileSafety } from "../../../src/core/packager/validateFileSafety.js";
import { RepomixConfigMerged } from "../../../src/config/configSchema.js";

describe("validateFileSafety", () => {
  const mockRawFiles: RawFile[] = [
    { path: "file1.txt", content: "content1" },
    { path: "file2.txt", content: "content2" },
    { path: "file3.txt", content: "content3" },
  ];

  const mockSuspiciousFilesResults: SuspiciousFileResult[] = [
    { filePath: "file2.txt", messages: ["message1"] },
  ];

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should return all files as safe when security check is disabled", async () => {
    const mockProgressCallback = vi.fn();
    const mockConfig = {
      security: {
        enableSecurityCheck: false,
      },
    } as unknown as RepomixConfigMerged;
    const result = await validateFileSafety(
      mockRawFiles,
      mockProgressCallback,
      mockConfig
    );

    expect(result.safeRawFiles).toEqual(mockRawFiles);
    expect(result.safeFilePaths).toEqual(mockRawFiles.map((file) => file.path));
    expect(result.suspiciousFilesResults).toEqual([]);
    expect(mockProgressCallback).not.toHaveBeenCalled();
  });

  it("should filter out suspicious files when security check is enabled", async () => {
    const mockProgressCallback = vi.fn();
    const mockConfig = {
      security: {
        enableSecurityCheck: true,
      },
    } as unknown as RepomixConfigMerged;
    const mockRunSecurityCheck = vi
      .fn()
      .mockResolvedValue(mockSuspiciousFilesResults);

    const result = await validateFileSafety(
      mockRawFiles,
      mockProgressCallback,
      mockConfig,
      mockRunSecurityCheck
    );

    const expectedSafeFiles = [
      { path: "file1.txt", content: "content1" },
      { path: "file3.txt", content: "content3" },
    ];

    expect(result.safeRawFiles).toEqual([
      { path: "file1.txt", content: "content1" },
      { path: "file3.txt", content: "content3" },
    ]);
    expect(result.safeFilePaths).toEqual(
      expectedSafeFiles.map((file) => file.path)
    );
    expect(result.suspiciousFilesResults).toEqual([
      {
        filePath: "file2.txt",
        messages: ["message1"],
      },
    ]);
    expect(mockProgressCallback).toHaveBeenCalledWith(
      "Running security check..."
    );
    expect(mockRunSecurityCheck).toHaveBeenCalledWith(
      mockRawFiles,
      mockProgressCallback
    );
  });
});

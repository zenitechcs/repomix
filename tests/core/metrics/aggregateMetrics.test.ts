import { describe, it, expect } from "vitest";
import {
  aggregateMetrics,
  type FileMetrics,
} from "../../../src/core/metrics/aggregateMetrics.js";
import type { ProcessedFile } from "../../../src/core/file/fileTypes.js";
import type { TokenCounter } from "../../../src/core/tokenCount/tokenCount.js";

describe("aggregateMetrics", () => {
  it("should aggregate metrics correctly", () => {
    const fileMetrics: FileMetrics[] = [
      { path: "file1.txt", charCount: 100, tokenCount: 10 },
      { path: "file2.txt", charCount: 200, tokenCount: 20 },
    ];
    const processedFiles: ProcessedFile[] = [
      { path: "file1.txt", content: "a" },
      { path: "file2.txt", content: "b".repeat(200) },
    ];
    const output = "a".repeat(300);
    const tokenCounter = {
      countTokens: (content: string) => content.length / 10,
    } as TokenCounter;

    const result = aggregateMetrics(
      fileMetrics,
      processedFiles,
      output,
      tokenCounter
    );

    expect(result).toEqual({
      totalFiles: 2,
      totalCharacters: 300,
      totalTokens: 30,
      fileCharCounts: {
        "file1.txt": 100,
        "file2.txt": 200,
      },
      fileTokenCounts: {
        "file1.txt": 10,
        "file2.txt": 20,
      },
    });
  });

  it("should handle empty file metrics", () => {
    const fileMetrics: FileMetrics[] = [];
    const processedFiles: ProcessedFile[] = [];
    const output = "";
    const tokenCounter = {
      countTokens: (content: string) => content.length / 10,
    } as TokenCounter;

    const result = aggregateMetrics(
      fileMetrics,
      processedFiles,
      output,
      tokenCounter
    );

    expect(result).toEqual({
      totalFiles: 0,
      totalCharacters: 0,
      totalTokens: 0,
      fileCharCounts: {},
      fileTokenCounts: {},
    });
  });
});

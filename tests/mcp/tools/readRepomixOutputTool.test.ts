import { describe, it, expect, vi, beforeEach } from 'vitest';
import fs from 'node:fs/promises';
import { registerReadRepomixOutputTool } from '../../../src/mcp/tools/readRepomixOutputTool.js';
import * as mcpToolRuntime from '../../../src/mcp/tools/mcpToolRuntime.js';

vi.mock('node:fs/promises');
vi.mock('../../../src/mcp/tools/mcpToolRuntime.js');
vi.mock('../../../src/shared/logger.js', () => ({
  logger: {
    trace: vi.fn(),
    error: vi.fn(),
  },
}));

describe('readRepomixOutputTool', () => {
  const mockMcpServer = {
    tool: vi.fn(),
  };
  
  let toolHandler: Function;
  
  beforeEach(() => {
    vi.resetAllMocks();
    
    registerReadRepomixOutputTool(mockMcpServer as any);
    
    toolHandler = mockMcpServer.tool.mock.calls[0][4];
  });
  
  it('should register the tool with correct parameters', () => {
    expect(mockMcpServer.tool).toHaveBeenCalledWith(
      'read_repomix_output',
      expect.any(String),
      expect.objectContaining({
        outputId: expect.any(Object),
      }),
      expect.objectContaining({
        title: 'Read Repomix Output',
        readOnlyHint: true,
        destructiveHint: false,
        idempotentHint: true,
        openWorldHint: false,
      }),
      expect.any(Function),
    );
  });
  
  it('should return an error if output file ID is not found', async () => {
    vi.mocked(mcpToolRuntime.getOutputFilePath).mockReturnValue(undefined);
    
    const result = await toolHandler({ outputId: 'non-existent-id' });
    
    expect(mcpToolRuntime.getOutputFilePath).toHaveBeenCalledWith('non-existent-id');
    expect(result.isError).toBe(true);
    expect(result.content[0].text).toContain('Error: Output file with ID non-existent-id not found');
  });
  
  it('should return an error if the file does not exist', async () => {
    vi.mocked(mcpToolRuntime.getOutputFilePath).mockReturnValue('/path/to/file.xml');
    vi.mocked(fs.access).mockRejectedValue(new Error('File not found'));
    
    const result = await toolHandler({ outputId: 'test-id' });
    
    expect(mcpToolRuntime.getOutputFilePath).toHaveBeenCalledWith('test-id');
    expect(fs.access).toHaveBeenCalledWith('/path/to/file.xml');
    expect(result.isError).toBe(true);
    expect(result.content[0].text).toContain('Error: Output file does not exist at path: /path/to/file.xml');
  });
  
  it('should successfully read the file content', async () => {
    vi.mocked(mcpToolRuntime.getOutputFilePath).mockReturnValue('/path/to/file.xml');
    vi.mocked(fs.access).mockResolvedValue(undefined);
    vi.mocked(fs.readFile).mockResolvedValue('File content here' as any);
    
    const result = await toolHandler({ outputId: 'test-id' });
    
    expect(mcpToolRuntime.getOutputFilePath).toHaveBeenCalledWith('test-id');
    expect(fs.access).toHaveBeenCalledWith('/path/to/file.xml');
    expect(fs.readFile).toHaveBeenCalledWith('/path/to/file.xml', 'utf8');
    expect(result.isError).toBeUndefined();
    expect(result.content).toHaveLength(2);
    expect(result.content[0].text).toContain('Content of Repomix output file (ID: test-id)');
    expect(result.content[1].text).toBe('File content here');
  });
  
  it('should handle unexpected errors during execution', async () => {
    vi.mocked(mcpToolRuntime.getOutputFilePath).mockImplementation(() => {
      throw new Error('Unexpected error');
    });
    
    const result = await toolHandler({ outputId: 'test-id' });
    
    expect(result.isError).toBe(true);
    expect(result.content[0].text).toContain('Error reading Repomix output: Unexpected error');
  });
});

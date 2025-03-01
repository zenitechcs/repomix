import type { SyntaxNode } from 'web-tree-sitter';
import type { ParseContext, ParseStrategy } from './ParseStrategy.js';

export class TypeScriptParseStrategy implements ParseStrategy {
  // Helper function to get function name
  private getFunctionName(lines: string[], startRow: number): string | null {
    const line = lines[startRow];
    // "export const functionName =" pattern detection
    const match = line.match(/(?:export\s+)?(?:const|let|var)\s+([a-zA-Z0-9_$]+)\s*=/);
    if (match?.[1]) {
      return match[1];
    }
    return null;
  }

  parseCapture(
    capture: { node: SyntaxNode; name: string },
    lines: string[],
    processedChunks: Set<string>,
    context: ParseContext,
  ): string | null {
    const { node, name } = capture;
    const startRow = node.startPosition.row;
    const endRow = node.endPosition.row;

    if (!lines[startRow]) {
      return null;
    }

    const isCommentCapture = name.includes('comment');
    const isTypeDefinitionCapture =
      name.includes('definition.interface') ||
      name.includes('definition.type') ||
      name.includes('definition.enum') ||
      name.includes('definition.class');
    const isImportCapture = name.includes('definition.import');
    const isFunctionCapture = name.includes('definition.function') || name.includes('definition.method');
    const isPropertyCapture = name.includes('definition.property');

    const isFullCapture = isCommentCapture || isTypeDefinitionCapture || isImportCapture || isPropertyCapture;

    if (!isFullCapture && !isFunctionCapture) {
      return null;
    }

    let selectedLines: string[] = [];

    if (isFunctionCapture) {
      const functionName = this.getFunctionName(lines, startRow);
      if (functionName && processedChunks.has(`func:${functionName}`)) {
        return null;
      }

      let signatureEndRow = startRow;

      for (let i = startRow; i <= endRow; i++) {
        const line = lines[i].trim();
        if (line.includes(')') && (line.endsWith('{') || line.endsWith('=>') || line.endsWith(';'))) {
          signatureEndRow = i;
          break;
        }
      }

      selectedLines = lines.slice(startRow, signatureEndRow + 1);

      const lastLineIndex = selectedLines.length - 1;
      const lastLine = selectedLines[lastLineIndex];

      if (lastLine) {
        if (lastLine.includes('{')) {
          selectedLines[lastLineIndex] = lastLine.substring(0, lastLine.indexOf('{')).trim();
        } else if (lastLine.includes('=>')) {
          selectedLines[lastLineIndex] = lastLine.substring(0, lastLine.indexOf('=>')).trim();
        }
      }

      const signature = selectedLines.join('\n').trim();
      if (processedChunks.has(signature)) {
        return null;
      }

      processedChunks.add(signature);
      if (functionName) {
        processedChunks.add(`func:${functionName}`);
      }
    } else if (isTypeDefinitionCapture && name.includes('definition.class')) {
      selectedLines = [lines[startRow]];

      if (startRow + 1 <= endRow) {
        const nextLine = lines[startRow + 1].trim();
        if (nextLine.includes('extends') || nextLine.includes('implements')) {
          selectedLines.push(nextLine);
        }
      }

      selectedLines = selectedLines.map((line) => {
        return line.replace(/\{.*$/, '').trim();
      });

      const definition = selectedLines.join('\n').trim();
      if (processedChunks.has(definition)) {
        return null;
      }
      processedChunks.add(definition);
    } else if (isTypeDefinitionCapture || isImportCapture) {
      selectedLines = lines.slice(startRow, endRow + 1);
      const definition = selectedLines.join('\n').trim();
      if (processedChunks.has(definition)) {
        return null;
      }
      processedChunks.add(definition);
    } else if (isCommentCapture) {
      selectedLines = lines.slice(startRow, endRow + 1);
    }

    return selectedLines.length > 0 ? selectedLines.join('\n').trim() : null;
  }
}

import type { SyntaxNode } from 'web-tree-sitter';
import type { ParseContext, ParseStrategy } from './ParseStrategy.js';

export class PythonParseStrategy implements ParseStrategy {
  // Get decorators
  private getDecorators(lines: string[], startRow: number): string[] {
    const decorators: string[] = [];
    let currentRow = startRow - 1;

    while (currentRow >= 0) {
      const line = lines[currentRow].trim();
      if (line.startsWith('@')) {
        decorators.unshift(line); // Add to beginning to maintain order
      } else {
        break;
      }
      currentRow--;
    }

    return decorators;
  }

  // Get class inheritance information
  private getClassInheritance(lines: string[], startRow: number): string | null {
    const line = lines[startRow];
    const match = line.match(/class\s+\w+\s*\((.*?)\):/);
    return match ? line.replace(/:\s*$/, '') : line.replace(/:\s*$/, '');
  }

  // Get function signature (including type annotations and decorators)
  private getFunctionSignature(lines: string[], startRow: number): string | null {
    const line = lines[startRow];
    const match = line.match(/def\s+(\w+)\s*\((.*?)\)(\s*->\s*[^:]+)?:/);
    if (!match) return null;

    // Return function definition only, excluding decorators
    return line.replace(/:\s*$/, '');
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
    const isClassCapture = name.includes('definition.class');
    const isFunctionCapture = name.includes('definition.function');
    const isDocstringCapture = name.includes('docstring');
    const isTypeAliasCapture = name.includes('definition.type_alias');

    // Process class definition
    if (isClassCapture) {
      const decorators = this.getDecorators(lines, startRow);
      const classDefinition = this.getClassInheritance(lines, startRow);

      const fullDefinition = [...decorators, classDefinition].join('\n');

      if (processedChunks.has(fullDefinition)) {
        return null;
      }
      processedChunks.add(fullDefinition);
      return fullDefinition;
    }

    // Process function definition
    if (isFunctionCapture) {
      const decorators = this.getDecorators(lines, startRow);
      const signature = this.getFunctionSignature(lines, startRow);

      if (!signature) return null;

      const fullDefinition = [...decorators, signature].join('\n');

      if (processedChunks.has(fullDefinition)) {
        return null;
      }
      processedChunks.add(fullDefinition);
      return fullDefinition;
    }

    // Process docstring
    if (isDocstringCapture) {
      const docstring = lines.slice(startRow, endRow + 1).join('\n');
      if (processedChunks.has(docstring)) {
        return null;
      }
      processedChunks.add(docstring);
      return docstring;
    }

    // Process comment
    if (isCommentCapture) {
      const comment = lines.slice(startRow, endRow + 1).join('\n');
      if (processedChunks.has(comment)) {
        return null;
      }
      processedChunks.add(comment);
      return comment;
    }

    // Process type alias
    if (isTypeAliasCapture) {
      const typeAlias = lines[startRow].trim();
      if (processedChunks.has(typeAlias)) {
        return null;
      }
      processedChunks.add(typeAlias);
      return typeAlias;
    }

    return null;
  }
}

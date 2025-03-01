import type { SyntaxNode } from 'web-tree-sitter';
import type { ParseContext, ParseStrategy } from './ParseStrategy.js';

export class GoParseStrategy implements ParseStrategy {
  // Helper function to get function name
  private getFunctionName(lines: string[], startRow: number): string | null {
    const line = lines[startRow];
    // "func funcName(" pattern detection
    const match = line.match(/func\s+([A-Za-z0-9_]+)\s*\(/);
    if (match?.[1]) {
      return match[1];
    }
    return null;
  }

  // Helper to get method name including receiver type
  private getMethodWithReceiver(lines: string[], startRow: number): string | null {
    const line = lines[startRow];
    // "func (r ReceiverType) methodName(" pattern detection
    const match = line.match(/func\s+\(([^)]+)\)\s+([A-Za-z0-9_]+)\s*\(/);
    if (match?.[2]) {
      return match[2];
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
      name.includes('definition.type') || name.includes('definition.interface') || name.includes('definition.struct');
    const isPackageCapture = name.includes('definition.package');
    const isImportCapture = name.includes('definition.import');
    const isFunctionCapture = name.includes('definition.function');
    const isMethodCapture = name.includes('definition.method');
    const isModuleCapture = name.includes('definition.module');
    const isVariableCapture = name.includes('definition.variable');
    const isConstantCapture = name.includes('definition.constant');

    // Handle comments
    if (isCommentCapture) {
      const comment = lines.slice(startRow, endRow + 1).join('\n');
      if (processedChunks.has(comment)) {
        return null;
      }
      processedChunks.add(comment);
      return comment;
    }

    if (isPackageCapture) {
      const packageDecl = lines[startRow].trim();
      if (processedChunks.has(packageDecl)) {
        return null;
      }
      processedChunks.add(packageDecl);
      return packageDecl;
    }

    // Handle package declarations
    if (isModuleCapture) {
      const packageDecl = lines[startRow].trim();
      if (processedChunks.has(packageDecl)) {
        return null;
      }
      processedChunks.add(packageDecl);
      return packageDecl;
    }

    // Handle import declarations
    if (isImportCapture) {
      // Check if it's a single import or import block
      if (lines[startRow].includes('(')) {
        // It's an import block
        const importBlock = lines.slice(startRow, endRow + 1).join('\n');
        if (processedChunks.has(importBlock)) {
          return null;
        }
        processedChunks.add(importBlock);
        return importBlock;
      }

      // It's a single import
      const importLine = lines[startRow].trim();
      if (processedChunks.has(importLine)) {
        return null;
      }
      processedChunks.add(importLine);
      return importLine;
    }

    // Handle variable declarations
    if (isVariableCapture) {
      // Find the entire variable declaration (might be multiple lines with var (...) block)
      let endVarRow = endRow;
      if (lines[startRow].includes('var (')) {
        // Find the closing parenthesis
        for (let i = startRow; i <= endRow; i++) {
          if (lines[i].includes(')')) {
            endVarRow = i;
            break;
          }
        }
      }
      const varDeclaration = lines.slice(startRow, endVarRow + 1).join('\n');
      if (processedChunks.has(varDeclaration)) {
        return null;
      }
      processedChunks.add(varDeclaration);
      return varDeclaration;
    }

    // Handle constant declarations
    if (isConstantCapture) {
      // Find the entire constant declaration (might be multiple lines with const (...) block)
      let endConstRow = endRow;
      if (lines[startRow].includes('const (')) {
        // Find the closing parenthesis
        for (let i = startRow; i <= endRow; i++) {
          if (lines[i].includes(')')) {
            endConstRow = i;
            break;
          }
        }
      }
      const constDeclaration = lines.slice(startRow, endConstRow + 1).join('\n');
      if (processedChunks.has(constDeclaration)) {
        return null;
      }
      processedChunks.add(constDeclaration);
      return constDeclaration;
    }

    // Handle type definitions (struct, interface, type alias)
    if (isTypeDefinitionCapture) {
      // Collect the entire type definition
      let signatureEndRow = endRow;

      // Find the closing brace for structs and interfaces
      if (lines[startRow].includes('{')) {
        for (let i = startRow; i <= endRow; i++) {
          if (lines[i].includes('}')) {
            signatureEndRow = i;
            break;
          }
        }
      }

      const definition = lines.slice(startRow, signatureEndRow + 1).join('\n');
      if (processedChunks.has(definition)) {
        return null;
      }
      processedChunks.add(definition);
      return definition;
    }

    // Handle function declarations
    if (isFunctionCapture) {
      const functionName = this.getFunctionName(lines, startRow);
      if (functionName && processedChunks.has(`func:${functionName}`)) {
        return null;
      }

      // Find the end of function signature (the opening brace of function body)
      let signatureEndRow = startRow;
      for (let i = startRow; i <= endRow; i++) {
        if (lines[i].includes('{')) {
          signatureEndRow = i;
          break;
        }
      }

      // Get the whole function signature
      const signature = lines
        .slice(startRow, signatureEndRow + 1)
        .join('\n')
        .trim();
      // Remove everything after the opening brace
      const cleanSignature = signature.split('{')[0].trim();

      if (processedChunks.has(cleanSignature)) {
        return null;
      }

      processedChunks.add(cleanSignature);
      if (functionName) {
        processedChunks.add(`func:${functionName}`);
      }
      return cleanSignature;
    }

    // Handle method declarations (with receiver)
    if (isMethodCapture) {
      const methodName = this.getMethodWithReceiver(lines, startRow);
      if (methodName && processedChunks.has(`method:${methodName}`)) {
        return null;
      }

      // Find the end of method signature (the opening brace of method body)
      let signatureEndRow = startRow;
      for (let i = startRow; i <= endRow; i++) {
        if (lines[i].includes('{')) {
          signatureEndRow = i;
          break;
        }
      }

      // Get the whole method signature
      const signature = lines
        .slice(startRow, signatureEndRow + 1)
        .join('\n')
        .trim();
      // Remove everything after the opening brace
      const cleanSignature = signature.split('{')[0].trim();

      if (processedChunks.has(cleanSignature)) {
        return null;
      }

      processedChunks.add(cleanSignature);
      if (methodName) {
        processedChunks.add(`method:${methodName}`);
      }
      return cleanSignature;
    }

    return null;
  }
}

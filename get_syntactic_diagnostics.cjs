const ts = require('typescript');
const fs = require('fs');

const fileName = './src/components/EmployeeDetailManager.tsx';
const content = fs.readFileSync(fileName, 'utf8');

const sourceFile = ts.createSourceFile(
  fileName,
  content,
  {
    target: ts.ScriptTarget.Latest,
    jsx: ts.JsxEmit.ReactJSX
  },
  true,
  ts.ScriptKind.TSX
);

// Get syntax diagnostics from compiler API
const diagnostics = sourceFile.parseDiagnostics || [];

console.log(`Found ${diagnostics.length} syntactic diagnostics:`);
diagnostics.forEach(diag => {
  const { line, character } = ts.getLineAndCharacterOfPosition(sourceFile, diag.start);
  const message = ts.flattenDiagnosticMessageText(diag.messageText, '\n');
  console.log(`Error at line ${line + 1}, col ${character + 1} (pos ${diag.start}): ${message}`);
  
  // Print 3 lines of context
  const lines = content.split('\n');
  const startL = Math.max(0, line - 2);
  const endL = Math.min(lines.length - 1, line + 2);
  console.log('--- Context ---');
  for (let l = startL; l <= endL; l++) {
    console.log(`${l + 1}: ${lines[l]}`);
  }
  console.log('---------------\n');
});

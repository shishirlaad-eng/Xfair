const ts = require('typescript');
const fs = require('fs');

const fileName = './src/components/EmployeeDetailManager.tsx';
const content = fs.readFileSync(fileName, 'utf8');
const lines = content.split('\n');

// We want to test removing structural ranges inside the main return statement (approx lines 244 to 1820)
// Let's divide lines 244 to 1820 (1-indexed, so array indices 243 to 1819) into blocks of 50 lines.
const startIdx = 243;
const endIdx = 1819;

function checkSyntax(testContent) {
  const sourceFile = ts.createSourceFile(
    'test.tsx',
    testContent,
    ts.ScriptTarget.Latest,
    true,
    ts.ScriptKind.TSX
  );
  return sourceFile.parseDiagnostics || [];
}

console.log('Original parse error diagnostics count:', checkSyntax(content).length);

// We will do a sliding window search by replacing a range of 80 lines with a blank string
const windowSize = 80;
const step = 40;

for (let i = startIdx; i < endIdx - windowSize; i += step) {
  const testLines = [
    ...lines.slice(0, i),
    '// REMOVED RANGE FOR DIAGNOSTICS test',
    ...lines.slice(i + windowSize)
  ];
  const testContent = testLines.join('\n');
  const diags = checkSyntax(testContent);
  if (diags.length === 0) {
    console.log(`🎯 FOUND INFLUENTIAL RANGE! Removing lines ${i + 1} to ${i + windowSize + 1} eliminated the syntax error!`);
    
    // Let's search inside this range line-by-line!
    console.log('Localizing line-by-line inside this range...');
    for (let j = i; j < i + windowSize; j++) {
      const singleLineRemovedLines = [
        ...lines.slice(0, j),
        '// REMOVED SINGLE LINE',
        ...lines.slice(j + 1)
      ];
      const singleLineRemovedContent = singleLineRemovedLines.join('\n');
      const innerDiags = checkSyntax(singleLineRemovedContent);
      if (innerDiags.length === 0) {
        console.log(`   🌟 LINE REMOVAL OF ${j + 1} ELIMINATED SYNTAX ERROR! Line ${j + 1}: ${lines[j]}`);
      }
    }
  }
}

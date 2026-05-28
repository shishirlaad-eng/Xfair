const fs = require('fs');

const code = fs.readFileSync('./src/components/EmployeeDetailManager.tsx', 'utf8');

// Strip comments and strings, but keep track of line numbers and section markers.
// We will replace characters in strings and comments with spaces so they don't affect tags,
// but preserve line endings and search for section markers.

let processed = '';
let i = 0;
let inLineComment = false;
let inBlockComment = false;
let inString = null;

while (i < code.length) {
  const c = code[i];
  const next = code[i + 1];

  if (c === '\n') {
    inLineComment = false;
    processed += '\n';
    i++;
    continue;
  }

  if (inLineComment) {
    processed += ' ';
    i++;
    continue;
  }

  if (inBlockComment) {
    if (c === '*' && next === '/') {
      inBlockComment = false;
      processed += '  ';
      i += 2;
    } else {
      processed += ' ';
      i++;
    }
    continue;
  }

  if (inString) {
    if (c === '\\') {
      processed += '  ';
      i += 2;
      continue;
    }
    if (c === inString) {
      inString = null;
    }
    processed += ' ';
    i++;
    continue;
  }

  if (c === '/' && next === '/') {
    inLineComment = true;
    processed += '  ';
    i += 2;
    continue;
  }
  if (c === '/' && next === '*') {
    inBlockComment = true;
    processed += '  ';
    i += 2;
    continue;
  }

  if (c === "'" || c === '"' || c === '`') {
    inString = c;
    processed += ' ';
    i++;
    continue;
  }

  processed += c;
  i++;
}

// Now scan processed line by line, keep track of cumulative div balance and print at section comments
const linesOriginal = code.split('\n');
const linesProcessed = processed.split('\n');

let balance = 0;
let openCount = 0;
let closeCount = 0;

linesProcessed.forEach((line, index) => {
  const lineNum = index + 1;
  const originalLine = linesOriginal[index];

  // Count <div and </div> on this line
  let pos = 0;
  while (pos < line.length) {
    if (line[pos] === '<') {
      if (line[pos + 1] === '/') {
        const rest = line.substring(pos + 2);
        const match = rest.match(/^div>/);
        if (match) {
          balance--;
          closeCount++;
          pos += 2 + match[0].length;
          continue;
        }
      } else {
        const rest = line.substring(pos + 1);
        const match = rest.match(/^div([\s>])/);
        if (match) {
          // Check if self-closing
          const endPos = rest.indexOf('>');
          if (endPos !== -1) {
            const body = rest.substring(0, endPos);
            if (!body.trim().endsWith('/')) {
              balance++;
              openCount++;
            }
          }
          pos += 1 + match[0].length;
          continue;
        }
      }
    }
    pos++;
  }

  // Print section headers
  if (originalLine.includes('SECTION') || originalLine.includes('Visual Profile Photo') || originalLine.includes('Business card segment')) {
    console.log(`Line ${lineNum.toString().padStart(4)}: Div Balance = ${balance} (Open=${openCount}, Close=${closeCount}) | ${originalLine.trim()}`);
  }
});

console.log(`Final at end of file: balance = ${balance} (Open=${openCount}, Close=${closeCount})`);

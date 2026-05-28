const fs = require('fs');

const code = fs.readFileSync('./src/components/EmployeeDetailManager.tsx', 'utf8');

// Find the main return statement of the component
const idx = code.indexOf('return (\n    <div className="w-full animate-fade-in"');
if (idx === -1) {
  console.log('Error: Could not find main return statement!');
  process.exit(1);
}
const part = code.substring(0, idx);

let pCount = 0; // parens
let bCount = 0; // braces
let sqCount = 0; // brackets
let lineNum = 1;

let inLineComment = false;
let inBlockComment = false;
let inString = null;

for (let i = 0; i < part.length; i++) {
  const c = part[i];
  const next = part[i + 1];

  if (c === '\n') {
    inLineComment = false;
    lineNum++;
    continue;
  }

  if (inLineComment) continue;
  if (inBlockComment) {
    if (c === '*' && next === '/') {
      inBlockComment = false;
      i++;
    }
    continue;
  }

  if (inString) {
    if (c === '\\') {
      i++;
      continue;
    }
    if (c === inString) {
      inString = null;
    }
    continue;
  }

  if (c === '/' && next === '/') {
    inLineComment = true;
    i++;
    continue;
  }
  if (c === '/' && next === '*') {
    inBlockComment = true;
    i++;
    continue;
  }

  if (c === "'" || c === '"' || c === '`') {
    inString = c;
    continue;
  }

  if (c === '(') pCount++;
  if (c === ')') pCount--;
  if (c === '{') bCount++;
  if (c === '}') bCount--;
  if (c === '[') sqCount++;
  if (c === ']') sqCount--;
}

console.log(`Summary up to main return statement (line ${lineNum}):`);
console.log(`Parentheses ( ) balance: ${pCount}`);
console.log(`Curly Braces { } balance: ${bCount}`);
console.log(`Square Brackets [ ] balance: ${sqCount}`);

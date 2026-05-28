const fs = require('fs');

const code = fs.readFileSync('./src/components/EmployeeDetailManager.tsx', 'utf8');

const idx = code.indexOf('return (');
const part = code.substring(0, idx);

let pCount = 0;
let bCount = 0;
let sqCount = 0;
const lines = part.split('\n');

let inLineComment = false;
let inBlockComment = false;
let inString = null;

lines.forEach((line, lineIdx) => {
  const lineNum = lineIdx + 1;
  
  for (let i = 0; i < line.length; i++) {
    const c = line[i];
    const next = line[i + 1];

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
      // Line comment ignores the rest of the line
      break;
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
  
  console.log(`Line ${lineNum}: P=${pCount} B=${bCount} S=${sqCount} | ${line.substring(0, 45)}`);
});

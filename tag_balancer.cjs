const fs = require('fs');

const code = fs.readFileSync('./src/components/EmployeeDetailManager.tsx', 'utf8');

// We will find all tags like <div, </div>, <button, </button>, etc.
// Let's strip strings and comments first to ignore any false positives inside them.
let stripped = '';
let i = 0;
let inLineComment = false;
let inBlockComment = false;
let inString = null;

while (i < code.length) {
  const c = code[i];
  const next = code[i + 1];

  if (c === '\n') {
    inLineComment = false;
    stripped += '\n';
    i++;
    continue;
  }

  if (inLineComment) {
    i++;
    continue;
  }

  if (inBlockComment) {
    if (c === '*' && next === '/') {
      inBlockComment = false;
      i += 2;
    } else {
      i++;
    }
    continue;
  }

  if (inString) {
    if (c === '\\') {
      i += 2;
      continue;
    }
    if (c === inString) {
      inString = null;
    }
    i++;
    continue;
  }

  if (c === '/' && next === '/') {
    inLineComment = true;
    i += 2;
    continue;
  }
  if (c === '/' && next === '*') {
    inBlockComment = true;
    i += 2;
    continue;
  }

  if (c === "'" || c === '"' || c === '`') {
    inString = c;
    i++;
    continue;
  }

  stripped += c;
  i++;
}

// Now search in stripped code for tags
const tags = ['div', 'button', 'span', 'p', 'label', 'h1', 'h2', 'h3', 'section', 'input', 'select', 'textarea', 'strong'];
const openCounts = {};
const closeCounts = {};
const selfClosingCounts = {};

tags.forEach(tag => {
  openCounts[tag] = 0;
  closeCounts[tag] = 0;
  selfClosingCounts[tag] = 0;
});

// A basic regex-based scanner for tags in stripped code
// We match <tag name... or </tag>
let pos = 0;
while (pos < stripped.length) {
  if (stripped[pos] === '<') {
    // Check if close tag </tag>
    if (stripped[pos + 1] === '/') {
      const rest = stripped.substring(pos + 2);
      const match = rest.match(/^([a-zA-Z1-9]+)>/);
      if (match) {
        const tag = match[1].toLowerCase();
        if (openCounts[tag] !== undefined) {
          closeCounts[tag] = (closeCounts[tag] || 0) + 1;
        }
        pos += 2 + match[0].length;
        continue;
      }
    } else if (stripped[pos + 1] !== '!') { // Skip <!DOCTYPE or comments if any left
      // Open tag <tag...
      const rest = stripped.substring(pos + 1);
      const match = rest.match(/^([a-zA-Z1-9]+)([\s\S]*?)>/);
      if (match) {
        const tag = match[1].toLowerCase();
        const tagBody = match[2];
        if (openCounts[tag] !== undefined) {
          if (tagBody.trim().endsWith('/')) {
            selfClosingCounts[tag] = (selfClosingCounts[tag] || 0) + 1;
          } else {
            openCounts[tag] = (openCounts[tag] || 0) + 1;
          }
        }
        pos += 1 + match[0].length;
        continue;
      }
    }
  }
  pos++;
}

console.log('--- Tag Balances Summary ---');
tags.forEach(tag => {
  const normOpen = openCounts[tag];
  const normClose = closeCounts[tag];
  const selfClose = selfClosingCounts[tag];
  const balance = normOpen - normClose;
  console.log(`${tag.padEnd(10)} | Open: ${normOpen.toString().padEnd(4)} | Close: ${normClose.toString().padEnd(4)} | Self-Close: ${selfClose.toString().padEnd(4)} | Balance: ${balance >= 0 ? '+' : ''}${balance}`);
});

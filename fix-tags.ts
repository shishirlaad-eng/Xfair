import fs from 'fs';

const file = 'src/components/EmployeeManager.tsx';
let content = fs.readFileSync(file, 'utf8');

// Replace the broken line:
const target = `</div          {/* BULK ACTION BAR (Right hand vertical panel reflecting exact event manager style) */}`;
const replacement = `</div>\n\n          {/* BULK ACTION BAR (Right hand vertical panel reflecting exact event manager style) */}`;

content = content.replace(target, replacement);

// Replace the end block if it is broken too:
content = content.replace('</div>iv>', '</div>');

fs.writeFileSync(file, content, 'utf8');
console.log('Tags fixed successfully!');

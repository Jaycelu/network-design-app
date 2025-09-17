const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'src/components/network-designer/DeviceManagement.tsx');
const content = fs.readFileSync(filePath, 'utf8');

let openBraces = 0;
let closeBraces = 0;

for (let i = 0; i < content.length; i++) {
  if (content[i] === '{') {
    openBraces++;
  } else if (content[i] === '}') {
    closeBraces++;
  }
}

console.log(`Open braces: ${openBraces}`);
console.log(`Close braces: ${closeBraces}`);
console.log(`Difference: ${openBraces - closeBraces}`);

if (openBraces === closeBraces) {
  console.log('Braces are balanced');
} else {
  console.log('Braces are NOT balanced');
}
const fs = require('fs');
const input = fs.readFileSync('/dev/stdin', 'utf-8').trim();
const count = [...input].filter(c => 'aeiou'.includes(c)).length;
console.log(count);
const fs = require('fs');
const path = require('path');

function walk(dir) {
  let results = [];
  const list = fs.readdirSync(dir);
  list.forEach(file => {
    file = path.resolve(dir, file);
    const stat = fs.statSync(file);
    if (stat && stat.isDirectory()) {
      results = results.concat(walk(file));
    } else if (file.endsWith('.html')) {
      results.push(file);
    }
  });
  return results;
}

const files = walk('src/app/components/forms');
files.forEach(f => {
  let content = fs.readFileSync(f, 'utf8');
  if (content.includes('type="date"') && !content.includes('max="2099-12-31"')) {
    content = content.replace(/type="date"/g, 'type="date" min="1900-01-01" max="2099-12-31"');
    fs.writeFileSync(f, content);
    console.log('Fixed ' + f);
  }
});

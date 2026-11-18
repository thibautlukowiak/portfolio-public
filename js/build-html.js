// Build index.html from html/ (<!-- include file.html -->)
const fs = require('fs')
const path = require('path')

const root = path.join(__dirname, '..')
const src = path.join(root, 'html')

const build = (file) =>
  fs
    .readFileSync(path.join(src, file), 'utf8')
    .replace(/^( *)<!-- include (\S+) -->\n/gm, (_, indent, partial) =>
      build(partial)
        .split('\n')
        .map((line) => (line ? indent + line : line))
        .join('\n')
    )

fs.writeFileSync(path.join(root, 'index.html'), build('index.html'))
console.log('index.html generated')

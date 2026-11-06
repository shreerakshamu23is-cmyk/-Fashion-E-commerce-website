import fs from 'fs';
import path from 'path';

// Target keywords per user instruction (tested with word boundary or exact phrase)
const targets = [
  'kimono',
  '34,500',
  '34500',
  'gsm',
  'merino',
  'boiled',
  'wool',
  'wools',
  'cocoon',
  'sandcast',
  'cedar',
  'bishu',
  'drape',
  'drapes',
  'autumn',
  'winter',
];

function walk(dir) {
  let results = [];
  const list = fs.readdirSync(dir);
  for (const file of list) {
    if (
      file === 'node_modules' ||
      file === '.git' ||
      file === 'dist' ||
      file === '.system_generated' ||
      file === 'grep-keywords.js'
    ) {
      continue;
    }
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    if (stat && stat.isDirectory()) {
      results = results.concat(walk(filePath));
    } else {
      results.push(filePath);
    }
  }
  return results;
}

const files = walk('.');
const occurrences = [];

for (const file of files) {
  try {
    const content = fs.readFileSync(file, 'utf8');
    targets.forEach((kw) => {
      // Use word boundaries for word targets, exact match for numbers/punctuations
      const isWord = /^[a-z]+$/i.test(kw);
      const pattern = isWord ? `\\b${kw}\\b` : kw.replace(/[-/\\^$*+?.()|[\]{}]/g, '\\$&');
      const regex = new RegExp(pattern, 'gi');
      let match;
      while ((match = regex.exec(content)) !== null) {
        occurrences.push({
          file,
          keyword: kw,
          match: match[0],
          line: content.substring(0, match.index).split('\n').length,
          snippet: content
            .substring(Math.max(0, match.index - 25), Math.min(content.length, match.index + 35))
            .replace(/\r?\n/g, ' ')
            .trim(),
        });
      }
    });
  } catch (err) {}
}

if (occurrences.length === 0) {
  console.log('GREP VERIFICATION RESULT: EMPTY (0 hits across all files)');
  console.log('All forbidden keywords have been completely eliminated.');
} else {
  console.log(`GREP VERIFICATION RESULT: ${occurrences.length} HIT(S) REMAINING:`);
  occurrences.forEach((h) => {
    console.log(`  [${h.keyword}] in ${h.file}:${h.line} -> "${h.snippet}"`);
  });
}

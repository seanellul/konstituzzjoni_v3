const fs = require('fs');
const path = require('path');

const BASE = path.join(__dirname, 'articles');
const OUT = path.join(__dirname, 'public', 'llms-full.txt');

const toc = JSON.parse(fs.readFileSync(path.join(BASE, 'constitution_toc.json'), 'utf8'));

// Chapter order from TOC
const chapters = Object.entries(toc["Constitution of Malta"]);

// Map chapter key to folder name and roman numeral
const chapterFolderMap = {
  "Chapter I - The Republic of Malta": { folder: "chapter_1", roman: "I" },
  "Chapter II - Declaration of Principles": { folder: "chapter_2", roman: "II" },
  "Chapter III - Citizenship": { folder: "chapter_3", roman: "III" },
  "Chapter IV - Fundamental Rights and Freedoms": { folder: "chapter_4", roman: "IV" },
  "Chapter V - The President": { folder: "chapter_5", roman: "V" },
  "Chapter VI - Parliament": { folder: "chapter_6", roman: "VI" },
  "Chapter VII - The Executive": { folder: "chapter_7", roman: "VII" },
  "Chapter VIII - The Judiciary": { folder: "chapter_8", roman: "VIII" },
  "Chapter IX - Finance": { folder: "chapter_9", roman: "IX" },
  "Chapter X - The Public Service": { folder: "chapter_10", roman: "X" },
  "Chapter XA - Local Councils": { folder: "chapter_10A", roman: "XA" },
  "Chapter XI - Miscellaneous": { folder: "chapter_11", roman: "XI" },
};

function getChapterTitle(key) {
  // "Chapter I - The Republic of Malta" => "The Republic of Malta"
  const m = key.match(/^Chapter\s+\S+\s+-\s+(.*)$/);
  return m ? m[1] : key;
}

function getRoman(key) {
  const m = key.match(/^Chapter\s+(\S+)/);
  return m ? m[1] : "";
}

function readArticle(folder, artNum) {
  const filePath = path.join(BASE, folder, `article_${artNum}.json`);
  if (!fs.existsSync(filePath)) {
    console.warn(`Missing: ${filePath}`);
    return null;
  }
  return JSON.parse(fs.readFileSync(filePath, 'utf8'));
}

function formatArticle(art) {
  let lines = [];
  lines.push(`### Article ${art.number} - ${art.title}`);
  lines.push('');
  if (art.content && art.content.length > 0) {
    for (const p of art.content) {
      lines.push(p.text);
      lines.push('');
    }
  }
  return lines.join('\n');
}

let output = [];
output.push('# Constitution of Malta - Full Text');
output.push('');
output.push('> Source: constitution.mt / konstituzzjoni.mt');
output.push('> This is the complete text of the Constitution of Malta for LLM consumption.');
output.push('> For official legal reference: https://legislation.mt/eli/const/eng/pdf');
output.push('');

for (const [chapterKey, chapterContent] of chapters) {
  const info = chapterFolderMap[chapterKey];
  if (!info) {
    console.warn(`No folder mapping for: ${chapterKey}`);
    continue;
  }

  const roman = info.roman;
  const title = getChapterTitle(chapterKey);

  output.push('---');
  output.push('');
  output.push(`## Chapter ${roman} - ${title}`);
  output.push('');

  // chapterContent can be flat { "1": "title", "2": "title" }
  // or nested with parts { "Part 1 - ...": { "51": "title", ... }, "Part 2 - ...": { ... } }

  function processArticles(articles, partHeading) {
    if (partHeading) {
      output.push(`#### ${partHeading}`);
      output.push('');
    }
    for (const [artNum, artTitle] of Object.entries(articles)) {
      const art = readArticle(info.folder, artNum);
      if (art) {
        output.push(formatArticle(art));
      } else {
        // Still show the article heading even if file missing
        output.push(`### Article ${artNum} - ${artTitle}`);
        output.push('');
        output.push('[Text not available]');
        output.push('');
      }
    }
  }

  // Check if content has parts (nested objects) or direct articles
  let hasParts = false;
  for (const [key, val] of Object.entries(chapterContent)) {
    if (typeof val === 'object' && val !== null) {
      hasParts = true;
      break;
    }
  }

  if (hasParts) {
    for (const [key, val] of Object.entries(chapterContent)) {
      if (typeof val === 'object' && val !== null) {
        processArticles(val, key);
      } else {
        // Direct article at top level mixed with parts (shouldn't happen but handle)
        const art = readArticle(info.folder, key);
        if (art) {
          output.push(formatArticle(art));
        }
      }
    }
  } else {
    processArticles(chapterContent, null);
  }
}

output.push('---');
output.push('');
output.push('End of the Constitution of Malta.');

fs.writeFileSync(OUT, output.join('\n'), 'utf8');
console.log(`Written to ${OUT}`);
console.log(`Total lines: ${output.length}`);

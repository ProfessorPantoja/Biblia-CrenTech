import fs from 'fs';
import path from 'path';

import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const OUTPUT_DIR = path.join(__dirname, '../public/bible');
const BIBLE_PATH = path.join(OUTPUT_DIR, 'acf.json');

// Ensure output directory exists
if (!fs.existsSync(OUTPUT_DIR)) {
    fs.mkdirSync(OUTPUT_DIR, { recursive: true });
}

console.log('Reading local Bible JSON...');

try {
    if (!fs.existsSync(BIBLE_PATH)) {
        throw new Error(`File not found: ${BIBLE_PATH}`);
    }

    let data = fs.readFileSync(BIBLE_PATH, 'utf8');
    // Strip BOM if present
    if (data.charCodeAt(0) === 0xFEFF) {
        data = data.slice(1);
    }
    console.log('Read complete. Parsing JSON...');
    const bible = JSON.parse(data);

    const index = [];

    bible.forEach((book) => {
        // Create a simplified abbreviation (lowercase, no special chars)
        const abbrev = book.abbrev.toLowerCase();

        // Save individual book file
        const bookPath = path.join(OUTPUT_DIR, `${abbrev}.json`);
        fs.writeFileSync(bookPath, JSON.stringify(book, null, 2));
        console.log(`Saved: ${book.name} -> ${abbrev}.json`);

        // Add to index
        index.push({
            name: book.name,
            abbrev: abbrev,
            chapters: book.chapters.length
        });
    });

    // Save index file
    const indexPath = path.join(OUTPUT_DIR, 'index.json');
    fs.writeFileSync(indexPath, JSON.stringify(index, null, 2));
    console.log('Saved: index.json');

    console.log('Done! Bible split successfully.');

} catch (error) {
    console.error('Error processing Bible JSON:', error.message);
}

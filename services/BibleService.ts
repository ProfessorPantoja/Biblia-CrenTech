import { BibleBook } from '../utils/bibleData';

export interface Verse {
    chapter: number;
    verse: number;
    text: string;
}

export interface Chapter {
    number: number;
    verses: string[];
}

export interface BookData {
    abbrev: string;
    name: string;
    chapters: string[][]; // Array of chapters, each chapter is array of verses
}

class BibleService {
    private static instance: BibleService;
    private loadedBooks: Map<string, BookData> = new Map();
    private index: BibleBook[] | null = null;

    private constructor() { }

    public static getInstance(): BibleService {
        if (!BibleService.instance) {
            BibleService.instance = new BibleService();
        }
        return BibleService.instance;
    }

    /**
     * Loads the Bible index (list of books)
     */
    public async getIndex(): Promise<BibleBook[]> {
        if (this.index) return this.index;

        try {
            const response = await fetch('/bible/index.json');
            if (!response.ok) throw new Error('Failed to load Bible index');
            this.index = await response.json();
            return this.index || [];
        } catch (error) {
            console.error('Error loading Bible index:', error);
            return [];
        }
    }

    /**
     * Loads a specific book by abbreviation
     */
    public async getBook(abbrev: string): Promise<BookData | null> {
        const cleanAbbrev = abbrev.toLowerCase();

        if (this.loadedBooks.has(cleanAbbrev)) {
            return this.loadedBooks.get(cleanAbbrev) || null;
        }

        try {
            const response = await fetch(`/bible/${cleanAbbrev}.json`);
            if (!response.ok) throw new Error(`Failed to load book: ${cleanAbbrev}`);

            const data = await response.json();
            this.loadedBooks.set(cleanAbbrev, data);
            return data;
        } catch (error) {
            console.error(`Error loading book ${cleanAbbrev}:`, error);
            return null;
        }
    }

    /**
     * Gets verses for a specific chapter
     */
    public async getChapter(bookAbbrev: string, chapter: number): Promise<string[] | null> {
        const book = await this.getBook(bookAbbrev);
        if (!book) return null;

        // Adjust for 0-based index if necessary, assuming JSON is 0-based array of chapters
        // Usually JSON structure is [ ["v1", "v2"], ["v1", "v2"] ]
        // So chapter 1 is at index 0
        const chapterIndex = chapter - 1;

        if (chapterIndex >= 0 && chapterIndex < book.chapters.length) {
            return book.chapters[chapterIndex];
        }
        return null;
    }

    /**
     * Preloads the next book in the sequence
     */
    public async preloadNextBook(currentAbbrev: string): Promise<void> {
        const index = await this.getIndex();
        const currentIndex = index.findIndex(b => b.abbrev.includes(currentAbbrev.toLowerCase()));

        if (currentIndex !== -1 && currentIndex < index.length - 1) {
            const nextBook = index[currentIndex + 1];
            // Use the first abbreviation for the filename
            const nextAbbrev = Array.isArray(nextBook.abbrev) ? nextBook.abbrev[0] : nextBook.abbrev;
            this.getBook(nextAbbrev as string);
        }
    }
}

export const bibleService = BibleService.getInstance();

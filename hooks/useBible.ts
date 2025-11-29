import { useState, useCallback } from 'react';
import { bibleService, BookData } from '../services/BibleService';
import { BIBLE_BOOKS } from '../utils/bibleData';

export interface BibleReference {
    book: string;
    chapter: number;
    verse?: number;
    endVerse?: number;
}

export const useBible = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const parseReference = (query: string): BibleReference | null => {
        // Normalize: remove extra spaces but KEEP accents (jó ≠ jo)
        const normalized = query.trim().replace(/\s+/g, ' ');

        // Pattern 1: Compact format with chapter+verse stuck together
        // "ap11" → ap 11:1, "jó1" → jó 1:1, "jo1" → joão 1:1
        const compactMatch = normalized.match(/^([a-zà-ÿ]+)(\d+)$/i);
        if (compactMatch) {
            const [, bookAbbrev, numberStr] = compactMatch;

            // Find book by abbreviation (case-insensitive, accent-sensitive)
            const book = BIBLE_BOOKS.find(b =>
                b.abbrev.some(a => a.toLowerCase() === bookAbbrev.toLowerCase())
            );

            if (book) {
                const number = parseInt(numberStr);
                // If single digit, treat as chapter 1, verse N
                // If double+ digit, treat as chapter N, verse 1
                if (numberStr.length === 1) {
                    return {
                        book: book.abbrev[0],
                        chapter: 1,
                        verse: number,
                        endVerse: undefined
                    };
                } else {
                    return {
                        book: book.abbrev[0],
                        chapter: number,
                        verse: 1,
                        endVerse: undefined
                    };
                }
            }
        }

        // Pattern 2: Standard flexible format with separators
        // "ap 11.4", "jó 11:4", "ap11.4", "JÓ 11:4", etc.
        const match = normalized.match(/^(\d?\s?[a-zà-ÿ]+)\s*(\d+)\s*[.:\s]\s*(\d+)(?:\s*[-–]\s*(\d+))?$/i);

        if (match) {
            const [, bookName, chapterStr, verseStr, endVerseStr] = match;
            const chapter = parseInt(chapterStr);
            const verse = parseInt(verseStr);
            const endVerse = endVerseStr ? parseInt(endVerseStr) : undefined;

            // Find book by name or abbreviation (case-insensitive, accent-sensitive)
            const book = BIBLE_BOOKS.find(b =>
                b.name.toLowerCase() === bookName.trim().toLowerCase() ||
                b.abbrev.some(a => a.toLowerCase() === bookName.trim().toLowerCase())
            );

            if (!book) return null;

            return {
                book: book.abbrev[0],
                chapter,
                verse,
                endVerse
            };
        }

        // Pattern 3: Chapter-only format (e.g., "ap 11", "jó 42")
        const chapterOnlyMatch = normalized.match(/^(\d?\s?[a-zà-ÿ]+)\s+(\d+)$/i);

        if (chapterOnlyMatch) {
            const [, bookName, chapterStr] = chapterOnlyMatch;
            const chapter = parseInt(chapterStr);

            const book = BIBLE_BOOKS.find(b =>
                b.name.toLowerCase() === bookName.trim().toLowerCase() ||
                b.abbrev.some(a => a.toLowerCase() === bookName.trim().toLowerCase())
            );

            if (!book) return null;

            return {
                book: book.abbrev[0],
                chapter,
                verse: undefined,
                endVerse: undefined
            };
        }

        return null;
    };

    const getVerses = useCallback(async (query: string) => {
        setIsLoading(true);
        setError(null);

        try {
            const ref = parseReference(query);
            if (!ref) {
                setIsLoading(false);
                return null; // Not a direct reference, maybe a theme search
            }

            const bookData = await bibleService.getBook(ref.book);
            if (!bookData) {
                throw new Error(`Livro não encontrado: ${ref.book}`);
            }

            const chapterVerses = await bibleService.getChapter(ref.book, ref.chapter);
            if (!chapterVerses) {
                throw new Error(`Capítulo não encontrado: ${ref.book} ${ref.chapter}`);
            }

            let resultVerses: { reference: string; text: string }[] = [];

            if (ref.verse) {
                const start = ref.verse - 1;
                const end = ref.endVerse ? ref.endVerse : ref.verse;

                // Validate range
                if (start < 0 || start >= chapterVerses.length) {
                    throw new Error(`Versículo não encontrado: ${ref.verse}`);
                }

                const selectedVerses = chapterVerses.slice(start, end);
                resultVerses = selectedVerses.map((text, idx) => ({
                    reference: `${bookData.name} ${ref.chapter}:${ref.verse! + idx}`,
                    text
                }));
            } else {
                // Return whole chapter
                resultVerses = chapterVerses.map((text, idx) => ({
                    reference: `${bookData.name} ${ref.chapter}:${idx + 1}`,
                    text
                }));
            }

            return resultVerses;

        } catch (err: any) {
            console.error("Bible fetch error:", err);
            setError(err.message);
            return null;
        } finally {
            setIsLoading(false);
        }
    }, []);

    return {
        getVerses,
        isLoading,
        error,
        parseReference
    };
};

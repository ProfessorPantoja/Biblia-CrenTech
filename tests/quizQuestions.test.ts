import { describe, it, expect } from 'vitest';
import { QUIZ_QUESTIONS } from '../data/quizQuestions';

describe('banco de perguntas do quiz', () => {
    it('tem pelo menos 60 perguntas', () => {
        expect(QUIZ_QUESTIONS.length).toBeGreaterThanOrEqual(60);
    });

    it('cada pergunta tem exatamente 4 opções, todas diferentes', () => {
        for (const q of QUIZ_QUESTIONS) {
            expect(q.options, q.question).toHaveLength(4);
            expect(new Set(q.options).size, q.question).toBe(4);
        }
    });

    it('answerIndex sempre aponta para uma opção existente', () => {
        for (const q of QUIZ_QUESTIONS) {
            expect(q.answerIndex, q.question).toBeGreaterThanOrEqual(0);
            expect(q.answerIndex, q.question).toBeLessThan(q.options.length);
        }
    });

    it('não há perguntas duplicadas', () => {
        const unique = new Set(QUIZ_QUESTIONS.map(q => q.question));
        expect(unique.size).toBe(QUIZ_QUESTIONS.length);
    });

    it('toda pergunta tem referência bíblica preenchida', () => {
        for (const q of QUIZ_QUESTIONS) {
            expect(q.reference.trim().length, q.question).toBeGreaterThan(0);
        }
    });
});

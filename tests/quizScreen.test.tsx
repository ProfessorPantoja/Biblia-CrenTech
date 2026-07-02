import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { AppProvider } from '../contexts/AppContext';
import { NavigationProvider } from '../contexts/NavigationContext';
import QuizScreen from '../components/QuizScreen';
import { QUIZ_QUESTIONS } from '../data/quizQuestions';

vi.mock('../utils/soundEngine', () => ({
    SoundEngine: {
        playClick: vi.fn(), playHover: vi.fn(), playSuccess: vi.fn(),
        playError: vi.fn(), playPing: vi.fn(), setMute: vi.fn(), startAmbient: vi.fn()
    }
}));

const renderQuiz = () =>
    render(
        <AppProvider>
            <NavigationProvider>
                <QuizScreen />
            </NavigationProvider>
        </AppProvider>
    );

// Descobre qual pergunta do banco está na tela agora
const findCurrentQuestion = () =>
    QUIZ_QUESTIONS.find(q => screen.queryByText(q.question) !== null)!;

describe('QuizScreen', () => {
    it('mostra a tela inicial com o botão Começar', () => {
        renderQuiz();
        expect(screen.getByText('Teste seu conhecimento')).toBeInTheDocument();
        expect(screen.getByText('Começar')).toBeInTheDocument();
    });

    it('responder certo marca ponto e mostra a referência bíblica', async () => {
        const user = userEvent.setup();
        renderQuiz();
        await user.click(screen.getByText('Começar'));

        expect(screen.getByText('Pergunta 1 de 10')).toBeInTheDocument();

        const question = findCurrentQuestion();
        const correctText = question.options[question.answerIndex];
        await user.click(screen.getByRole('button', { name: correctText }));

        expect(screen.getByText(question.reference)).toBeInTheDocument();
        await user.click(screen.getByText('Próxima pergunta'));
        expect(screen.getByText('Pergunta 2 de 10')).toBeInTheDocument();
    });

    it('uma rodada completa chega à tela de resultado e salva o recorde', async () => {
        const user = userEvent.setup();
        renderQuiz();
        await user.click(screen.getByText('Começar'));

        for (let i = 0; i < 10; i++) {
            const question = findCurrentQuestion();
            const correctText = question.options[question.answerIndex];
            await user.click(screen.getByRole('button', { name: correctText }));
            await user.click(screen.getByText(i === 9 ? 'Ver resultado' : 'Próxima pergunta'));
        }

        // 10 acertos: resultado, mensagem de parabéns e recorde persistido
        expect(screen.getByText('Jogar novamente')).toBeInTheDocument();
        expect(screen.getByText(/Excelente/)).toBeInTheDocument();
        expect(screen.getByText('Recorde!')).toBeInTheDocument();
        expect(JSON.parse(localStorage.getItem('bible_crentech_quiz_best')!)).toBe(10);
    });
});

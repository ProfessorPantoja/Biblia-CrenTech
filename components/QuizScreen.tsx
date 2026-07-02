import React from 'react';
import { ChevronLeft, Trophy, BookOpen, RotateCcw, Check, X } from 'lucide-react';
import { THEMES } from '../config/constants';
import { useApp } from '../contexts/AppContext';
import { useNavigation } from '../contexts/NavigationContext';
import { SoundEngine } from '../utils/soundEngine';
import { StorageService } from '../services/StorageService';
import { QUIZ_QUESTIONS, QuizQuestion } from '../data/quizQuestions';

const ROUND_SIZE = 10;
const BEST_SCORE_KEY = 'bible_crentech_quiz_best';

type QuizPhase = 'start' | 'playing' | 'end';

const shuffle = <T,>(items: T[]): T[] => {
    const result = [...items];
    for (let i = result.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [result[i], result[j]] = [result[j], result[i]];
    }
    return result;
};

// Sorteia as perguntas da rodada e embaralha as alternativas de cada uma
const buildRound = (): QuizQuestion[] =>
    shuffle(QUIZ_QUESTIONS).slice(0, ROUND_SIZE).map(q => {
        const options = shuffle(q.options);
        return { ...q, options, answerIndex: options.indexOf(q.options[q.answerIndex]) };
    });

const QuizScreen: React.FC = () => {
    const { appTheme } = useApp();
    const { navigate } = useNavigation();
    const currentTheme = THEMES[appTheme];

    const [phase, setPhase] = React.useState<QuizPhase>('start');
    const [round, setRound] = React.useState<QuizQuestion[]>([]);
    const [questionIndex, setQuestionIndex] = React.useState(0);
    const [selected, setSelected] = React.useState<number | null>(null);
    const [score, setScore] = React.useState(0);
    const [bestScore, setBestScore] = React.useState(() => StorageService.load<number>(BEST_SCORE_KEY, 0));
    const [isNewRecord, setIsNewRecord] = React.useState(false);

    const question = round[questionIndex];
    const isLastQuestion = questionIndex === round.length - 1;

    const startRound = () => {
        SoundEngine.playClick();
        setRound(buildRound());
        setQuestionIndex(0);
        setSelected(null);
        setScore(0);
        setIsNewRecord(false);
        setPhase('playing');
    };

    const handleAnswer = (optionIndex: number) => {
        if (selected !== null) return;
        setSelected(optionIndex);
        if (optionIndex === question.answerIndex) {
            setScore(prev => prev + 1);
            SoundEngine.playSuccess();
        } else {
            SoundEngine.playError();
        }
    };

    const handleNext = () => {
        SoundEngine.playClick();
        if (isLastQuestion) {
            if (score > bestScore) {
                setBestScore(score);
                setIsNewRecord(true);
                StorageService.save(BEST_SCORE_KEY, score);
            }
            setPhase('end');
        } else {
            setQuestionIndex(prev => prev + 1);
            setSelected(null);
        }
    };

    const endMessage = () => {
        const ratio = score / ROUND_SIZE;
        if (ratio >= 0.9) return 'Excelente! Você conhece muito a Palavra! 🎉';
        if (ratio >= 0.7) return 'Muito bem! Continue firme nos estudos! 👏';
        if (ratio >= 0.5) return 'Bom começo! A prática leva à perfeição. 💪';
        return 'Continue estudando, a Palavra transforma! 📖';
    };

    const optionClasses = (optionIndex: number) => {
        const base = 'w-full p-4 rounded-xl text-left font-medium border transition-all active:scale-[0.99]';
        if (selected === null) {
            return `${base} bg-white/5 border-white/10 hover:bg-white/10 ${currentTheme.textClass}`;
        }
        if (optionIndex === question.answerIndex) {
            return `${base} bg-green-500/20 border-green-400 text-green-100`;
        }
        if (optionIndex === selected) {
            return `${base} bg-red-500/20 border-red-400 text-red-100`;
        }
        return `${base} bg-white/5 border-white/5 opacity-40 ${currentTheme.textClass}`;
    };

    return (
        <div className={`min-h-screen w-full flex flex-col ${currentTheme.bgClass} transition-colors duration-700`}>

            {/* HEADER */}
            <header className={`sticky top-0 z-30 p-4 pt-6 backdrop-blur-xl bg-opacity-80 border-b border-white/5 flex items-center justify-between shadow-sm ${currentTheme.bgClass}`}>
                <button
                    onClick={() => navigate('home')}
                    className="p-2 rounded-full hover:bg-white/10 transition-colors"
                >
                    <ChevronLeft size={24} className={currentTheme.textClass} />
                </button>
                <div className="flex flex-col items-center">
                    <h1 className={`font-bold text-lg ${currentTheme.textClass}`}>Quiz Bíblico</h1>
                    {phase === 'playing' && (
                        <span className="text-xs opacity-50 uppercase tracking-widest">
                            Pergunta {questionIndex + 1} de {round.length}
                        </span>
                    )}
                </div>
                <div className="w-10 flex justify-center">
                    {phase === 'playing' && (
                        <span className="text-sm font-bold text-amber-400">{score}</span>
                    )}
                </div>
            </header>

            <main className="flex-1 p-6 w-full max-w-xl mx-auto flex flex-col">

                {/* START */}
                {phase === 'start' && (
                    <div className="flex-1 flex flex-col items-center justify-center text-center space-y-6 animate-in fade-in duration-500">
                        <div className="w-24 h-24 rounded-full bg-amber-400/15 border-2 border-amber-400/60 flex items-center justify-center shadow-[0_0_30px_rgba(251,191,36,0.25)]">
                            <Trophy size={44} className="text-amber-400" />
                        </div>
                        <div className="space-y-2">
                            <h2 className={`text-2xl font-bold ${currentTheme.textClass}`}>Teste seu conhecimento</h2>
                            <p className={`${currentTheme.textClass} opacity-60 text-sm leading-relaxed max-w-xs mx-auto`}>
                                {ROUND_SIZE} perguntas sorteadas sobre a Bíblia. Cada resposta mostra a referência para você estudar.
                            </p>
                        </div>
                        {bestScore > 0 && (
                            <div className="px-4 py-2 rounded-full bg-white/5 border border-amber-400/30 text-amber-300 text-sm font-semibold">
                                🏆 Seu recorde: {bestScore}/{ROUND_SIZE}
                            </div>
                        )}
                        <button
                            onClick={startRound}
                            className="px-10 py-4 bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-500 hover:to-amber-600 text-slate-900 font-bold text-lg rounded-2xl shadow-lg shadow-amber-500/25 active:scale-95 transition-all"
                        >
                            Começar
                        </button>
                    </div>
                )}

                {/* PLAYING */}
                {phase === 'playing' && question && (
                    <div className="flex-1 flex flex-col space-y-5 animate-in fade-in duration-300" key={questionIndex}>
                        {/* Progress bar */}
                        <div className="w-full bg-white/10 rounded-full h-2 overflow-hidden">
                            <div
                                className="bg-gradient-to-r from-amber-400 to-amber-600 h-full rounded-full transition-all duration-500"
                                style={{ width: `${((questionIndex + (selected !== null ? 1 : 0)) / round.length) * 100}%` }}
                            />
                        </div>

                        {/* Question card */}
                        <div className="rounded-2xl p-6 backdrop-blur-xl bg-white/5 border border-amber-400/20 shadow-xl">
                            <p className={`text-lg font-semibold leading-relaxed ${currentTheme.textClass}`}>
                                {question.question}
                            </p>
                        </div>

                        {/* Options */}
                        <div className="space-y-3">
                            {question.options.map((option, optionIndex) => (
                                <button
                                    key={option}
                                    onClick={() => handleAnswer(optionIndex)}
                                    disabled={selected !== null}
                                    className={optionClasses(optionIndex)}
                                >
                                    <span className="flex items-center justify-between gap-2">
                                        <span>{option}</span>
                                        {selected !== null && optionIndex === question.answerIndex && <Check size={18} className="text-green-400 flex-shrink-0" />}
                                        {selected !== null && optionIndex === selected && optionIndex !== question.answerIndex && <X size={18} className="text-red-400 flex-shrink-0" />}
                                    </span>
                                </button>
                            ))}
                        </div>

                        {/* Feedback + next */}
                        {selected !== null && (
                            <div className="space-y-4 animate-in fade-in slide-in-from-bottom-2 duration-300">
                                <div className="flex items-center justify-center gap-2 text-sm">
                                    <BookOpen size={16} className="text-amber-400" />
                                    <span className={`${currentTheme.textClass} opacity-70`}>Referência:</span>
                                    <span className="font-bold text-amber-400">{question.reference}</span>
                                </div>
                                <button
                                    onClick={handleNext}
                                    className="w-full py-4 bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-500 hover:to-amber-600 text-slate-900 font-bold rounded-xl shadow-lg shadow-amber-500/20 active:scale-95 transition-all"
                                >
                                    {isLastQuestion ? 'Ver resultado' : 'Próxima pergunta'}
                                </button>
                            </div>
                        )}
                    </div>
                )}

                {/* END */}
                {phase === 'end' && (
                    <div className="flex-1 flex flex-col items-center justify-center text-center space-y-6 animate-in fade-in zoom-in-95 duration-500">
                        <div className="relative">
                            <div className="w-32 h-32 rounded-full bg-amber-400/15 border-4 border-amber-400 flex flex-col items-center justify-center shadow-[0_0_40px_rgba(251,191,36,0.3)]">
                                <span className={`text-4xl font-bold ${currentTheme.textClass}`}>{score}</span>
                                <span className={`text-sm opacity-60 ${currentTheme.textClass}`}>de {ROUND_SIZE}</span>
                            </div>
                            {isNewRecord && (
                                <span className="absolute -top-2 -right-6 rotate-12 px-3 py-1 rounded-full bg-amber-400 text-slate-900 text-xs font-bold shadow-lg">
                                    Recorde!
                                </span>
                            )}
                        </div>
                        <p className={`text-lg font-semibold max-w-xs ${currentTheme.textClass}`}>{endMessage()}</p>
                        <div className="flex flex-col gap-3 w-full max-w-xs">
                            <button
                                onClick={startRound}
                                className="w-full py-4 bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-500 hover:to-amber-600 text-slate-900 font-bold rounded-xl shadow-lg shadow-amber-500/20 active:scale-95 transition-all flex items-center justify-center gap-2"
                            >
                                <RotateCcw size={18} />
                                <span>Jogar novamente</span>
                            </button>
                            <button
                                onClick={() => navigate('home')}
                                className={`w-full py-3 border border-white/15 rounded-xl font-semibold hover:bg-white/5 transition-all ${currentTheme.textClass}`}
                            >
                                Voltar para Home
                            </button>
                        </div>
                    </div>
                )}
            </main>
        </div>
    );
};

export default QuizScreen;

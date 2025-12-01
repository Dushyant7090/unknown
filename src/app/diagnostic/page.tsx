"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Loader2, ArrowRight, CheckCircle2, AlertCircle, Brain } from "lucide-react";
import { generateQuestions, analyzeResults } from "@/lib/gemini";
import { supabase } from "@/lib/supabase";
import { QuestionCard } from "@/components/diagnostic/question-card";
import { TestProgress } from "@/components/diagnostic/test-progress";
import { DiagnosticSidePanel } from "@/components/diagnostic/side-panel";
import { useRouter, useSearchParams } from "next/navigation";

type TestState = "idle" | "generating" | "testing" | "analyzing" | "results";

interface Question {
    question_text: string;
    options: string[];
    correct_answer: string;
    difficulty: string;
}

interface Analysis {
    strengths: string[];
    weaknesses: string[];
    learning_path: { step: string; description: string }[];
    overall_score: number;
}

export default function DiagnosticPage() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const initialTopic = searchParams.get("topic") || "";

    const [state, setState] = useState<TestState>("idle");
    const [topic, setTopic] = useState(initialTopic);
    const [questions, setQuestions] = useState<Question[]>([]);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [answers, setAnswers] = useState<{ question: string; answer: string; correct: boolean }[]>([]);
    const [selectedOption, setSelectedOption] = useState<string | null>(null);
    const [analysis, setAnalysis] = useState<Analysis | null>(null);

    // Auto-start if topic is provided via URL
    useEffect(() => {
        if (initialTopic && state === "idle") {
            handleStartTest(initialTopic);
        }
    }, [initialTopic]);

    const handleStartTest = async (topicToUse?: string) => {
        const currentTopic = topicToUse || topic;
        if (!currentTopic.trim()) return;

        setState("generating");
        try {
            const generatedQuestions = await generateQuestions(currentTopic);
            if (generatedQuestions && generatedQuestions.length > 0) {
                setQuestions(generatedQuestions);

                // Save questions to Supabase
                try {
                    await supabase.from('diagnostic_questions').insert(
                        generatedQuestions.map((q: any) => ({
                            topic: currentTopic,
                            question_text: q.question_text,
                            options: q.options,
                            correct_answer: q.correct_answer,
                            difficulty: q.difficulty
                        }))
                    );
                } catch (err) {
                    console.error("Failed to save questions:", err);
                }

                setState("testing");
            } else {
                alert("Failed to generate questions. Please try again.");
                setState("idle");
            }
        } catch (error) {
            console.error(error);
            setState("idle");
        }
    };

    const handleOptionSelect = (option: string) => {
        setSelectedOption(option);
    };

    const handleConfirmAnswer = async () => {
        if (!selectedOption) return;

        const currentQ = questions[currentQuestionIndex];
        const isCorrect = selectedOption === currentQ.correct_answer;

        const newAnswer = {
            question: currentQ.question_text,
            answer: selectedOption,
            correct: isCorrect,
        };

        const updatedAnswers = [...answers, newAnswer];
        setAnswers(updatedAnswers);
        setSelectedOption(null);

        if (currentQuestionIndex < questions.length - 1) {
            setCurrentQuestionIndex((prev) => prev + 1);
        } else {
            await submitTest(updatedAnswers);
        }
    };

    const submitTest = async (finalAnswers: any[]) => {
        setState("analyzing");
        try {
            // 1. Save answers to Supabase
            // Using a dummy user ID for now since we don't have auth yet
            const dummyUserId = "00000000-0000-0000-0000-000000000000";

            try {
                await supabase.from('user_answers').insert(
                    finalAnswers.map(a => ({
                        user_id: dummyUserId,
                        question_id: "00000000-0000-0000-0000-000000000000", // Placeholder as we didn't track IDs perfectly here
                        selected_answer: a.answer,
                        is_correct: a.correct,
                        time_taken_seconds: 0 // Placeholder
                    }))
                );
            } catch (err) {
                console.error("Failed to save answers:", err);
            }

            // 2. Analyze results
            const result = await analyzeResults(topic, finalAnswers);
            setAnalysis(result);

            // 3. Save learning path
            if (result) {
                try {
                    await supabase.from('learning_paths').insert({
                        user_id: dummyUserId,
                        topic,
                        analysis_json: result
                    });
                } catch (err) {
                    console.error("Failed to save learning path:", err);
                }
            }

            setState("results");
        } catch (error) {
            console.error(error);
            alert("Error analyzing results.");
            setState("idle");
        }
    };

    return (
        <div className="min-h-screen bg-[#030303] text-white flex flex-col relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/[0.05] via-transparent to-rose-500/[0.05] blur-3xl pointer-events-none" />

            <main className="flex-1 container mx-auto px-4 py-12 relative z-10 flex flex-col items-center justify-center min-h-[80vh]">
                <AnimatePresence mode="wait">
                    {state === "idle" && (
                        <motion.div
                            key="idle"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            className="max-w-xl w-full text-center"
                        >
                            <div className="mb-8 inline-flex items-center justify-center w-20 h-20 rounded-3xl bg-white/[0.05] border border-white/10">
                                <Brain className="w-10 h-10 text-indigo-400" />
                            </div>
                            <h1 className="text-4xl md:text-5xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-b from-white to-white/60">
                                What do you want to learn?
                            </h1>
                            <p className="text-white/40 text-lg mb-10">
                                Enter a topic, and our AI will generate a personalized diagnostic test to assess your skills.
                            </p>

                            <div className="relative max-w-md mx-auto">
                                <input
                                    type="text"
                                    value={topic}
                                    onChange={(e) => setTopic(e.target.value)}
                                    placeholder="e.g., Python Recursion, React Hooks..."
                                    className="w-full px-6 py-4 rounded-full bg-white/[0.05] border border-white/10 text-white placeholder:text-white/20 focus:outline-none focus:border-indigo-500/50 focus:bg-white/[0.08] transition-all text-lg"
                                    onKeyDown={(e) => e.key === "Enter" && handleStartTest()}
                                />
                                <button
                                    onClick={() => handleStartTest()}
                                    disabled={!topic.trim()}
                                    className="absolute right-2 top-2 bottom-2 px-6 rounded-full bg-white text-black font-semibold hover:bg-white/90 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                                >
                                    Start
                                </button>
                            </div>
                        </motion.div>
                    )}

                    {state === "generating" && (
                        <motion.div
                            key="generating"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="text-center"
                        >
                            <Loader2 className="w-12 h-12 text-indigo-500 animate-spin mx-auto mb-6" />
                            <h2 className="text-2xl font-semibold text-white mb-2">Generating Questions...</h2>
                            <p className="text-white/40">Our AI is crafting a unique test for {topic}</p>
                        </motion.div>
                    )}

                    {state === "testing" && (
                        <motion.div
                            key="testing"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="w-full max-w-6xl"
                        >
                            <div className="flex gap-8 items-start">
                                <div className="flex-1">
                                    <TestProgress currentQuestion={currentQuestionIndex} totalQuestions={questions.length} />

                                    <QuestionCard
                                        question={questions[currentQuestionIndex]}
                                        selectedOption={selectedOption}
                                        onSelectOption={handleOptionSelect}
                                    />

                                    <div className="mt-12 flex justify-end max-w-2xl mx-auto">
                                        <button
                                            onClick={handleConfirmAnswer}
                                            disabled={!selectedOption}
                                            className="flex items-center gap-2 px-8 py-4 rounded-full bg-white text-black font-bold text-lg hover:bg-white/90 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                                        >
                                            {currentQuestionIndex === questions.length - 1 ? "Finish Test" : "Next Question"}
                                            <ArrowRight className="w-5 h-5" />
                                        </button>
                                    </div>
                                </div>

                                <DiagnosticSidePanel
                                    topic={topic}
                                    currentQuestionIndex={currentQuestionIndex}
                                    totalQuestions={questions.length}
                                />
                            </div>
                        </motion.div>
                    )}

                    {state === "analyzing" && (
                        <motion.div
                            key="analyzing"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="text-center"
                        >
                            <Loader2 className="w-12 h-12 text-rose-500 animate-spin mx-auto mb-6" />
                            <h2 className="text-2xl font-semibold text-white mb-2">Analyzing Results...</h2>
                            <p className="text-white/40">Identifying your strengths and learning gaps</p>
                        </motion.div>
                    )}

                    {state === "results" && analysis && (
                        <motion.div
                            key="results"
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="w-full max-w-4xl"
                        >
                            <div className="text-center mb-12">
                                <div className="inline-block px-4 py-1 rounded-full bg-white/10 border border-white/10 text-sm text-white/60 mb-6">
                                    Analysis Complete
                                </div>
                                <h2 className="text-4xl font-bold mb-4">Your Learning Profile</h2>
                                <div className="text-6xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-rose-400">
                                    {analysis.overall_score}%
                                </div>
                                <p className="text-white/40 mt-2">Overall Mastery Score</p>
                            </div>

                            <div className="grid md:grid-cols-2 gap-8 mb-12">
                                <div className="p-8 rounded-3xl bg-white/[0.03] border border-white/[0.08]">
                                    <h3 className="flex items-center gap-2 text-xl font-semibold mb-6 text-emerald-400">
                                        <CheckCircle2 className="w-5 h-5" /> Strengths
                                    </h3>
                                    <ul className="space-y-3">
                                        {analysis.strengths.map((s, i) => (
                                            <li key={i} className="flex items-start gap-3 text-white/70">
                                                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-2.5" />
                                                {s}
                                            </li>
                                        ))}
                                    </ul>
                                </div>

                                <div className="p-8 rounded-3xl bg-white/[0.03] border border-white/[0.08]">
                                    <h3 className="flex items-center gap-2 text-xl font-semibold mb-6 text-amber-400">
                                        <AlertCircle className="w-5 h-5" /> Areas for Improvement
                                    </h3>
                                    <ul className="space-y-3">
                                        {analysis.weaknesses.map((w, i) => (
                                            <li key={i} className="flex items-start gap-3 text-white/70">
                                                <span className="w-1.5 h-1.5 rounded-full bg-amber-500 mt-2.5" />
                                                {w}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </div>

                            <div className="p-8 rounded-3xl bg-gradient-to-br from-indigo-500/10 to-rose-500/10 border border-white/10">
                                <h3 className="text-2xl font-bold mb-8 text-center">Recommended Learning Path</h3>
                                <div className="space-y-6">
                                    {analysis.learning_path.map((step, i) => (
                                        <div key={i} className="flex gap-6 items-start">
                                            <div className="w-8 h-8 flex-shrink-0 flex items-center justify-center rounded-full bg-white/10 border border-white/20 font-bold text-sm">
                                                {i + 1}
                                            </div>
                                            <div>
                                                <h4 className="text-lg font-semibold text-white mb-1">{step.step}</h4>
                                                <p className="text-white/50 text-sm leading-relaxed">{step.description}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="mt-12 text-center flex justify-center gap-4">
                                <button
                                    onClick={() => {
                                        setState("idle");
                                        setTopic("");
                                        setQuestions([]);
                                        setCurrentQuestionIndex(0);
                                        setAnswers([]);
                                        setAnalysis(null);
                                    }}
                                    className="px-8 py-3 rounded-full bg-white/5 border border-white/10 hover:bg-white/10 transition-colors"
                                >
                                    Start New Test
                                </button>
                                <button
                                    onClick={() => router.push(`/dashboard/${encodeURIComponent(topic)}`)}
                                    className="px-8 py-3 rounded-full bg-white text-black font-semibold hover:bg-white/90 transition-colors"
                                >
                                    Go to Dashboard
                                </button>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </main>
        </div>
    );
}

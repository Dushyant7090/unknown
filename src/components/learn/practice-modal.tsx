"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle2, XCircle, HelpCircle } from "lucide-react";
import { cn } from "@/lib/utils";

interface PracticeQuestion {
    question: string;
    options: string[];
    correct_answer: string;
    explanation: string;
}

interface PracticeModalProps {
    isOpen: boolean;
    onClose: () => void;
    question: PracticeQuestion;
    onComplete: () => void;
}

export function PracticeModal({ isOpen, onClose, question, onComplete }: PracticeModalProps) {
    const [selectedOption, setSelectedOption] = useState<string | null>(null);
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [isCorrect, setIsCorrect] = useState(false);

    const handleSubmit = () => {
        if (!selectedOption) return;

        const correct = selectedOption === question.correct_answer;
        setIsCorrect(correct);
        setIsSubmitted(true);

        if (correct) {
            setTimeout(() => {
                onComplete();
            }, 2000);
        }
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="absolute inset-0 bg-black/80 backdrop-blur-sm"
                        onClick={onClose}
                    />

                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 20 }}
                        className="relative w-full max-w-lg bg-[#0A0A0A] border border-white/10 rounded-2xl p-6 shadow-2xl overflow-hidden"
                    >
                        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-indigo-500 to-rose-500" />

                        <div className="flex items-start gap-4 mb-6">
                            <div className="p-3 rounded-xl bg-indigo-500/10 border border-indigo-500/20">
                                <HelpCircle className="w-6 h-6 text-indigo-400" />
                            </div>
                            <div>
                                <h3 className="text-xl font-bold text-white mb-1">Practice Question</h3>
                                <p className="text-white/60 text-sm">Test your understanding of this concept.</p>
                            </div>
                        </div>

                        <p className="text-lg text-white mb-6 font-medium leading-relaxed">
                            {question.question}
                        </p>

                        <div className="space-y-3 mb-8">
                            {question.options.map((option, index) => {
                                const isSelected = selectedOption === option;
                                const showCorrect = isSubmitted && option === question.correct_answer;
                                const showWrong = isSubmitted && isSelected && !isCorrect;

                                return (
                                    <button
                                        key={index}
                                        onClick={() => !isSubmitted && setSelectedOption(option)}
                                        disabled={isSubmitted}
                                        className={cn(
                                            "w-full p-4 text-left rounded-xl border transition-all relative overflow-hidden",
                                            showCorrect ? "bg-emerald-500/20 border-emerald-500 text-white" :
                                                showWrong ? "bg-rose-500/20 border-rose-500 text-white" :
                                                    isSelected ? "bg-indigo-500/20 border-indigo-500 text-white" :
                                                        "bg-white/5 border-white/10 text-white/70 hover:bg-white/10"
                                        )}
                                    >
                                        <div className="flex items-center justify-between relative z-10">
                                            <span className="flex items-center gap-3">
                                                <span className={cn(
                                                    "w-6 h-6 flex items-center justify-center rounded-full text-xs font-bold border",
                                                    showCorrect ? "bg-emerald-500 border-emerald-500 text-white" :
                                                        showWrong ? "bg-rose-500 border-rose-500 text-white" :
                                                            isSelected ? "bg-indigo-500 border-indigo-500 text-white" :
                                                                "border-white/20 text-white/40"
                                                )}>
                                                    {String.fromCharCode(65 + index)}
                                                </span>
                                                {option}
                                            </span>

                                            {showCorrect && <CheckCircle2 className="w-5 h-5 text-emerald-400" />}
                                            {showWrong && <XCircle className="w-5 h-5 text-rose-400" />}
                                        </div>
                                    </button>
                                );
                            })}
                        </div>

                        {isSubmitted && (
                            <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: "auto" }}
                                className={cn(
                                    "mb-6 p-4 rounded-xl border text-sm leading-relaxed",
                                    isCorrect ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-200" : "bg-rose-500/10 border-rose-500/20 text-rose-200"
                                )}
                            >
                                <p className="font-semibold mb-1">
                                    {isCorrect ? "Correct!" : "Incorrect"}
                                </p>
                                {question.explanation}
                            </motion.div>
                        )}

                        <div className="flex justify-end gap-3">
                            <button
                                onClick={onClose}
                                className="px-4 py-2 rounded-lg text-white/60 hover:text-white transition-colors"
                            >
                                Cancel
                            </button>
                            {!isSubmitted ? (
                                <button
                                    onClick={handleSubmit}
                                    disabled={!selectedOption}
                                    className="px-6 py-2 rounded-lg bg-white text-black font-semibold hover:bg-white/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                >
                                    Check Answer
                                </button>
                            ) : !isCorrect ? (
                                <button
                                    onClick={() => {
                                        setIsSubmitted(false);
                                        setSelectedOption(null);
                                    }}
                                    className="px-6 py-2 rounded-lg bg-white/10 text-white font-semibold hover:bg-white/20 transition-colors"
                                >
                                    Try Again
                                </button>
                            ) : (
                                <button
                                    onClick={onComplete}
                                    className="px-6 py-2 rounded-lg bg-emerald-500 text-white font-semibold hover:bg-emerald-600 transition-colors"
                                >
                                    Continue
                                </button>
                            )}
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
}

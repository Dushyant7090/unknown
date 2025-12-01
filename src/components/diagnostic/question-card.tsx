"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface QuestionCardProps {
    question: {
        question_text: string;
        options: string[];
    };
    selectedOption: string | null;
    onSelectOption: (option: string) => void;
}

export function QuestionCard({ question, selectedOption, onSelectOption }: QuestionCardProps) {
    return (
        <div className="w-full max-w-2xl mx-auto">
            <motion.h2
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-2xl md:text-3xl font-bold text-white mb-8 leading-tight"
            >
                {question.question_text}
            </motion.h2>

            <div className="grid gap-4">
                {question.options.map((option, index) => (
                    <motion.button
                        key={index}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                        onClick={() => onSelectOption(option)}
                        className={cn(
                            "w-full p-6 text-left rounded-xl border transition-all duration-200 group relative overflow-hidden",
                            selectedOption === option
                                ? "bg-indigo-500/20 border-indigo-500 text-white"
                                : "bg-white/5 border-white/10 text-white/70 hover:bg-white/10 hover:border-white/20"
                        )}
                    >
                        <div className="flex items-center gap-4 relative z-10">
                            <span className={cn(
                                "w-8 h-8 flex items-center justify-center rounded-full text-sm font-bold border transition-colors",
                                selectedOption === option
                                    ? "bg-indigo-500 border-indigo-500 text-white"
                                    : "bg-transparent border-white/20 text-white/40 group-hover:border-white/40"
                            )}>
                                {String.fromCharCode(65 + index)}
                            </span>
                            <span className="text-lg">{option}</span>
                        </div>
                    </motion.button>
                ))}
            </div>
        </div>
    );
}

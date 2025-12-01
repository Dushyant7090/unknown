"use client";

import { motion } from "framer-motion";
import { Lightbulb, Target, Trophy, Zap } from "lucide-react";

interface DiagnosticSidePanelProps {
    topic: string;
    currentQuestionIndex: number;
    totalQuestions: number;
}

export function DiagnosticSidePanel({ topic, currentQuestionIndex, totalQuestions }: DiagnosticSidePanelProps) {
    const progress = ((currentQuestionIndex + 1) / totalQuestions) * 100;

    const tips = [
        "Take your time to understand the question.",
        "Eliminate obviously wrong answers first.",
        "Read all options before selecting one.",
        "Trust your first instinct if you're unsure.",
        "Look for keywords in the question text."
    ];

    const currentTip = tips[currentQuestionIndex % tips.length];

    return (
        <div className="hidden lg:block w-80 space-y-6">
            {/* Progress Section */}
            <div className="p-6 rounded-3xl bg-white/[0.03] border border-white/[0.08]">
                <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                    <Target className="w-5 h-5 text-indigo-400" />
                    Progress
                </h3>
                <div className="mb-2 flex justify-between text-sm text-white/60">
                    <span>Question {currentQuestionIndex + 1} of {totalQuestions}</span>
                    <span>{Math.round(progress)}%</span>
                </div>
                <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                    <motion.div
                        className="h-full bg-gradient-to-r from-indigo-500 to-rose-500"
                        initial={{ width: 0 }}
                        animate={{ width: `${progress}%` }}
                        transition={{ duration: 0.5 }}
                    />
                </div>
            </div>

            {/* Expected Skills */}
            <div className="p-6 rounded-3xl bg-white/[0.03] border border-white/[0.08]">
                <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                    <Trophy className="w-5 h-5 text-amber-400" />
                    Expected Skills
                </h3>
                <ul className="space-y-3">
                    <li className="flex items-center gap-3 text-white/70 text-sm">
                        <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                        Core Concepts Understanding
                    </li>
                    <li className="flex items-center gap-3 text-white/70 text-sm">
                        <div className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                        Problem Solving Logic
                    </li>
                    <li className="flex items-center gap-3 text-white/70 text-sm">
                        <div className="w-1.5 h-1.5 rounded-full bg-purple-500" />
                        Syntax & Implementation
                    </li>
                </ul>
            </div>

            {/* Tip of the moment */}
            <div className="p-6 rounded-3xl bg-gradient-to-br from-indigo-500/10 to-purple-500/10 border border-white/10">
                <h3 className="text-lg font-semibold text-white mb-3 flex items-center gap-2">
                    <Lightbulb className="w-5 h-5 text-yellow-400" />
                    Quick Tip
                </h3>
                <p className="text-white/60 text-sm leading-relaxed">
                    {currentTip}
                </p>
            </div>

            {/* Motivation */}
            <div className="p-6 rounded-3xl bg-white/[0.03] border border-white/[0.08]">
                <div className="flex items-center gap-3 mb-2">
                    <Zap className="w-5 h-5 text-rose-400" />
                    <span className="font-medium text-white">Keep going!</span>
                </div>
                <p className="text-white/40 text-xs">
                    You're doing great. Every question helps build your personalized learning path.
                </p>
            </div>
        </div>
    );
}

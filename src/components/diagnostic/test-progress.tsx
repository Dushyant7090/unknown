"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";

interface TestProgressProps {
    currentQuestion: number;
    totalQuestions: number;
}

export function TestProgress({ currentQuestion, totalQuestions }: TestProgressProps) {
    const [seconds, setSeconds] = useState(0);

    useEffect(() => {
        const timer = setInterval(() => {
            setSeconds((s) => s + 1);
        }, 1000);
        return () => clearInterval(timer);
    }, []);

    const progress = ((currentQuestion + 1) / totalQuestions) * 100;

    const formatTime = (totalSeconds: number) => {
        const mins = Math.floor(totalSeconds / 60);
        const secs = totalSeconds % 60;
        return `${mins}:${secs.toString().padStart(2, "0")}`;
    };

    return (
        <div className="w-full max-w-2xl mx-auto mb-12">
            <div className="flex justify-between items-end mb-4">
                <div>
                    <span className="text-sm text-white/40 uppercase tracking-wider font-medium">Question</span>
                    <div className="text-2xl font-bold text-white">
                        {currentQuestion + 1} <span className="text-white/40 text-lg">/ {totalQuestions}</span>
                    </div>
                </div>
                <div className="text-right">
                    <span className="text-sm text-white/40 uppercase tracking-wider font-medium">Time Elapsed</span>
                    <div className="text-xl font-mono text-white/80">{formatTime(seconds)}</div>
                </div>
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
    );
}

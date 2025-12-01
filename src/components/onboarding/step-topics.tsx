"use client";

import { motion } from "framer-motion";
import { ChevronLeft, Sparkles, ArrowRight, Search } from "lucide-react";
import { useState } from "react";

interface StepTopicsProps {
    subject: string;
    onSelect: (topic: string) => void;
    onBack: () => void;
}

// Helper to get topics based on subject
const getTopics = (subject: string) => {
    // This would ideally come from an API, but we'll mock it for now
    const topics: Record<string, { name: string; difficulty: string }[]> = {
        "Programming Basics": [
            { name: "Variables & Data Types", difficulty: "Beginner" },
            { name: "Control Structures", difficulty: "Beginner" },
            { name: "Functions", difficulty: "Intermediate" },
        ],
        "Data Structures & Algorithms": [
            { name: "Arrays & Strings", difficulty: "Beginner" },
            { name: "Linked Lists", difficulty: "Intermediate" },
            { name: "Recursion", difficulty: "Intermediate" },
            { name: "Trees & Graphs", difficulty: "Advanced" },
        ],
        "Web Development": [
            { name: "HTML5 & CSS3", difficulty: "Beginner" },
            { name: "JavaScript Basics", difficulty: "Intermediate" },
            { name: "React Components", difficulty: "Intermediate" },
        ],
        // Default fallback
        "default": [
            { name: `${subject} Fundamentals`, difficulty: "Beginner" },
            { name: `${subject} Advanced Concepts`, difficulty: "Advanced" },
        ]
    };

    return topics[subject] || topics["default"];
};

export function StepTopics({ subject, onSelect, onBack }: StepTopicsProps) {
    const recommendedTopics = getTopics(subject);
    const [manualTopic, setManualTopic] = useState("");

    return (
        <div className="w-full max-w-4xl mx-auto">
            <button
                onClick={onBack}
                className="mb-8 flex items-center gap-2 text-white/40 hover:text-white transition-colors"
            >
                <ChevronLeft className="w-4 h-4" />
                Back
            </button>

            <h2 className="text-3xl md:text-4xl font-bold text-center mb-4 bg-clip-text text-transparent bg-gradient-to-b from-white to-white/60">
                Recommended Topics
            </h2>
            <p className="text-center text-white/40 mb-12 text-lg">
                Based on your interest in <span className="text-white">{subject}</span>
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-16">
                {recommendedTopics.map((topic, index) => (
                    <motion.div
                        key={topic.name}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="p-6 rounded-3xl border border-white/10 bg-white/[0.03] hover:bg-white/[0.06] transition-all duration-300 group"
                    >
                        <div className="flex justify-between items-start mb-4">
                            <div className="px-3 py-1 rounded-full bg-indigo-500/20 border border-indigo-500/30 text-indigo-300 text-xs font-medium flex items-center gap-1">
                                <Sparkles className="w-3 h-3" /> Recommended
                            </div>
                            <span className={`text-xs font-medium px-2 py-1 rounded-md border ${topic.difficulty === "Beginner" ? "border-emerald-500/30 text-emerald-400 bg-emerald-500/10" :
                                    topic.difficulty === "Intermediate" ? "border-amber-500/30 text-amber-400 bg-amber-500/10" :
                                        "border-rose-500/30 text-rose-400 bg-rose-500/10"
                                }`}>
                                {topic.difficulty}
                            </span>
                        </div>

                        <h3 className="text-xl font-bold text-white mb-6">{topic.name}</h3>

                        <button
                            onClick={() => onSelect(topic.name)}
                            className="w-full py-3 rounded-xl bg-white text-black font-semibold hover:bg-white/90 transition-colors flex items-center justify-center gap-2"
                        >
                            Start Test <ArrowRight className="w-4 h-4" />
                        </button>
                    </motion.div>
                ))}
            </div>

            {/* Manual Selection */}
            <div className="max-w-md mx-auto text-center">
                <div className="flex items-center gap-4 mb-4">
                    <div className="h-px bg-white/10 flex-1" />
                    <span className="text-white/40 text-sm uppercase tracking-wider">Or choose manually</span>
                    <div className="h-px bg-white/10 flex-1" />
                </div>

                <div className="relative">
                    <input
                        type="text"
                        value={manualTopic}
                        onChange={(e) => setManualTopic(e.target.value)}
                        placeholder="Enter any topic..."
                        className="w-full px-6 py-4 rounded-full bg-white/[0.05] border border-white/10 text-white placeholder:text-white/20 focus:outline-none focus:border-indigo-500/50 focus:bg-white/[0.08] transition-all pr-32"
                        onKeyDown={(e) => e.key === "Enter" && manualTopic && onSelect(manualTopic)}
                    />
                    <button
                        onClick={() => manualTopic && onSelect(manualTopic)}
                        disabled={!manualTopic}
                        className="absolute right-2 top-2 bottom-2 px-6 rounded-full bg-indigo-600 text-white font-medium hover:bg-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                    >
                        Start
                    </button>
                </div>
            </div>
        </div>
    );
}

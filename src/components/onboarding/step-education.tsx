"use client";

import { motion } from "framer-motion";
import { GraduationCap, School, BookOpen, Award, User } from "lucide-react";

interface StepEducationProps {
    onSelect: (level: string) => void;
}

const educationLevels = [
    {
        id: "high_school",
        title: "High School",
        description: "Currently in school or recently graduated (10th/12th)",
        icon: School,
        color: "text-blue-400",
        bg: "bg-blue-500/10",
        border: "hover:border-blue-500/50",
    },
    {
        id: "diploma",
        title: "Diploma",
        description: "Pursuing or completed a technical diploma",
        icon: Award,
        color: "text-emerald-400",
        bg: "bg-emerald-500/10",
        border: "hover:border-emerald-500/50",
    },
    {
        id: "undergraduate",
        title: "Undergraduate",
        description: "Pursuing a Bachelor's degree (B.Tech, BCA, B.Sc, etc.)",
        icon: GraduationCap,
        color: "text-indigo-400",
        bg: "bg-indigo-500/10",
        border: "hover:border-indigo-500/50",
    },
    {
        id: "postgraduate",
        title: "Postgraduate",
        description: "Pursuing a Master's degree (M.Tech, MCA, MBA, etc.)",
        icon: BookOpen,
        color: "text-purple-400",
        bg: "bg-purple-500/10",
        border: "hover:border-purple-500/50",
    },
    {
        id: "other",
        title: "Other / Self-taught",
        description: "Learning on your own or through bootcamps",
        icon: User,
        color: "text-rose-400",
        bg: "bg-rose-500/10",
        border: "hover:border-rose-500/50",
    },
];

export function StepEducation({ onSelect }: StepEducationProps) {
    return (
        <div className="w-full max-w-5xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-4 bg-clip-text text-transparent bg-gradient-to-b from-white to-white/60">
                Select Your Education Level
            </h2>
            <p className="text-center text-white/40 mb-12 text-lg">
                Help us tailor the learning path to your current stage.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {educationLevels.map((level, index) => (
                    <motion.button
                        key={level.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        onClick={() => onSelect(level.id)}
                        className={`group relative p-6 rounded-3xl border border-white/10 bg-white/[0.03] text-left transition-all duration-300 hover:bg-white/[0.06] ${level.border}`}
                    >
                        <div className={`w-12 h-12 rounded-2xl flex items-center justify-center mb-4 ${level.bg}`}>
                            <level.icon className={`w-6 h-6 ${level.color}`} />
                        </div>
                        <h3 className="text-xl font-semibold text-white mb-2 group-hover:text-white transition-colors">
                            {level.title}
                        </h3>
                        <p className="text-white/40 text-sm leading-relaxed group-hover:text-white/60 transition-colors">
                            {level.description}
                        </p>
                    </motion.button>
                ))}
            </div>
        </div>
    );
}

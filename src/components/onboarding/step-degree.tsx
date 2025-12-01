"use client";

import { motion } from "framer-motion";
import { ChevronLeft } from "lucide-react";
import { useState } from "react";

interface StepDegreeProps {
    educationLevel: string;
    onSelect: (degree: string) => void;
    onBack: () => void;
}

const degreesByLevel: Record<string, string[]> = {
    high_school: ["PCM", "PCB", "Commerce with CS", "Arts with CS", "Other"],
    diploma: [
        "Computer Science Diploma",
        "IT Diploma",
        "Mechanical Diploma",
        "Electronics Diploma",
        "Civil Diploma",
        "Other",
    ],
    undergraduate: [
        "BCA",
        "B.Tech / BE",
        "B.Sc CS",
        "B.Sc IT",
        "BBA (IT)",
        "Other",
    ],
    postgraduate: ["MCA", "M.Tech", "M.Sc CS/IT", "MBA IT", "Other"],
    other: ["Self-taught", "Bootcamp", "Career Switcher", "Hobbyist"],
};

export function StepDegree({ educationLevel, onSelect, onBack }: StepDegreeProps) {
    const [showOtherInput, setShowOtherInput] = useState(false);
    const [customDegree, setCustomDegree] = useState("");
    const [selectedDegree, setSelectedDegree] = useState("");

    const degrees = degreesByLevel[educationLevel] || degreesByLevel["other"];

    const handleDegreeClick = (degree: string) => {
        if (degree === "Other") {
            setShowOtherInput(true);
            setSelectedDegree("Other");
        } else {
            setShowOtherInput(false);
            setSelectedDegree(degree);
            onSelect(degree);
        }
    };

    const handleCustomSubmit = () => {
        if (customDegree.trim().length >= 3) {
            onSelect(customDegree);
        }
    };

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
                Select Your Degree / Path
            </h2>
            <p className="text-center text-white/40 mb-12 text-lg">
                What specific program are you enrolled in?
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {degrees.map((degree, index) => (
                    <motion.button
                        key={degree}
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: index * 0.05 }}
                        onClick={() => handleDegreeClick(degree)}
                        className={`p-6 rounded-2xl border transition-all duration-300 text-left group ${selectedDegree === degree
                            ? "bg-indigo-500/20 border-indigo-500/50"
                            : "border-white/10 bg-white/[0.03] hover:bg-white/[0.08] hover:border-indigo-500/30"
                            }`}
                    >
                        <h3 className={`text-lg font-medium transition-colors ${selectedDegree === degree ? "text-indigo-300" : "text-white group-hover:text-indigo-300"
                            }`}>
                            {degree}
                        </h3>
                    </motion.button>
                ))}
            </div>

            {showOtherInput && (
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-8 max-w-md mx-auto"
                >
                    <label className="block text-sm text-white/60 mb-2 ml-2">Enter your degree / program name</label>
                    <div className="relative">
                        <input
                            type="text"
                            value={customDegree}
                            onChange={(e) => setCustomDegree(e.target.value)}
                            placeholder="e.g. B.Arch, Biotechnology..."
                            className="w-full px-6 py-4 rounded-xl bg-white/[0.05] border border-white/10 text-white placeholder:text-white/20 focus:outline-none focus:border-indigo-500/50 focus:bg-white/[0.08] transition-all"
                            onKeyDown={(e) => e.key === "Enter" && handleCustomSubmit()}
                            autoFocus
                        />
                        <button
                            onClick={handleCustomSubmit}
                            disabled={customDegree.trim().length < 3}
                            className="absolute right-2 top-2 bottom-2 px-6 rounded-lg bg-indigo-600 text-white font-medium hover:bg-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                        >
                            Continue
                        </button>
                    </div>
                    {customDegree.length > 0 && customDegree.length < 3 && (
                        <p className="text-rose-400 text-xs mt-2 ml-2">Name must be at least 3 characters long</p>
                    )}
                </motion.div>
            )}
        </div>
    );
}

"use client";

import { motion } from "framer-motion";
import { ChevronLeft, Loader2, Star } from "lucide-react";
import { useState, useEffect } from "react";
import { generateSubjects } from "@/lib/gemini";

interface StepSubjectProps {
    degree: string;
    onSelect: (subject: string) => void;
    onBack: () => void;
}

export function StepSubject({ degree, onSelect, onBack }: StepSubjectProps) {
    const [subjects, setSubjects] = useState<string[]>([]);
    const [loading, setLoading] = useState(true);
    const [showOtherInput, setShowOtherInput] = useState(false);
    const [customSubject, setCustomSubject] = useState("");
    const [selectedSubject, setSelectedSubject] = useState("");

    useEffect(() => {
        const fetchSubjects = async () => {
            setLoading(true);
            try {
                const generated = await generateSubjects(degree);
                if (generated && generated.length > 0) {
                    setSubjects(generated);
                } else {
                    // Fallback if generation fails
                    setSubjects(["Programming Basics", "Data Structures", "Web Development", "Database Management"]);
                }
            } catch (error) {
                console.error("Failed to fetch subjects:", error);
                setSubjects(["Programming Basics", "Data Structures", "Web Development", "Database Management"]);
            } finally {
                setLoading(false);
            }
        };

        fetchSubjects();
    }, [degree]);

    const handleSubjectClick = (subject: string) => {
        if (subject === "Other") {
            setShowOtherInput(true);
            setSelectedSubject("Other");
        } else {
            setShowOtherInput(false);
            setSelectedSubject(subject);
            onSelect(subject);
        }
    };

    const handleCustomSubmit = () => {
        if (customSubject.trim().length >= 3) {
            onSelect(customSubject);
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
                Select Your Subject
            </h2>
            <p className="text-center text-white/40 mb-12 text-lg">
                Which subject do you want to focus on today?
            </p>

            {loading ? (
                <div className="text-center py-12">
                    <Loader2 className="w-8 h-8 text-indigo-500 animate-spin mx-auto mb-4" />
                    <p className="text-white/40">Analyzing your degree...</p>
                </div>
            ) : (
                <>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
                        {subjects.map((subject, index) => (
                            <motion.button
                                key={subject}
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: index * 0.05 }}
                                onClick={() => handleSubjectClick(subject)}
                                className={`p-6 rounded-2xl border transition-all duration-300 text-left group ${selectedSubject === subject
                                        ? "bg-indigo-500/20 border-indigo-500/50"
                                        : "border-white/10 bg-white/[0.03] hover:bg-white/[0.08] hover:border-indigo-500/30"
                                    }`}
                            >
                                <h3 className={`text-lg font-medium transition-colors ${selectedSubject === subject ? "text-indigo-300" : "text-white group-hover:text-indigo-300"
                                    }`}>
                                    {subject}
                                </h3>
                            </motion.button>
                        ))}

                        {/* Always show Other option */}
                        <motion.button
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: subjects.length * 0.05 }}
                            onClick={() => handleSubjectClick("Other")}
                            className={`p-6 rounded-2xl border transition-all duration-300 text-left group ${selectedSubject === "Other"
                                    ? "bg-indigo-500/20 border-indigo-500/50"
                                    : "border-white/10 bg-white/[0.03] hover:bg-white/[0.08] hover:border-indigo-500/30"
                                }`}
                        >
                            <h3 className={`text-lg font-medium transition-colors ${selectedSubject === "Other" ? "text-indigo-300" : "text-white group-hover:text-indigo-300"
                                }`}>
                                Other
                            </h3>
                        </motion.button>
                    </div>

                    {showOtherInput && (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="mt-8 max-w-md mx-auto"
                        >
                            <label className="block text-sm text-white/60 mb-2 ml-2">Enter custom subject</label>
                            <div className="relative">
                                <input
                                    type="text"
                                    value={customSubject}
                                    onChange={(e) => setCustomSubject(e.target.value)}
                                    placeholder="e.g. Cloud Computing, Bioinformatics..."
                                    className="w-full px-6 py-4 rounded-xl bg-white/[0.05] border border-white/10 text-white placeholder:text-white/20 focus:outline-none focus:border-indigo-500/50 focus:bg-white/[0.08] transition-all"
                                    onKeyDown={(e) => e.key === "Enter" && handleCustomSubmit()}
                                    autoFocus
                                />
                                <button
                                    onClick={handleCustomSubmit}
                                    disabled={customSubject.trim().length < 3}
                                    className="absolute right-2 top-2 bottom-2 px-6 rounded-lg bg-indigo-600 text-white font-medium hover:bg-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                                >
                                    Continue
                                </button>
                            </div>
                            {customSubject.length > 0 && customSubject.length < 3 && (
                                <p className="text-rose-400 text-xs mt-2 ml-2">Subject must be at least 3 characters long</p>
                            )}
                        </motion.div>
                    )}
                </>
            )}
        </div>
    );
}

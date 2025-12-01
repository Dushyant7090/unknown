"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, Loader2, CheckCircle2, Play, BookOpen, Code2, Sparkles, Lightbulb } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { generateModuleContent, generateModuleTips } from "@/lib/gemini";
import { PracticeModal } from "@/components/learn/practice-modal";
import ReactMarkdown from "react-markdown";
import confetti from "canvas-confetti";

interface ModuleContent {
    explanation: string;
    code_snippet: string;
    practice_question: {
        question: string;
        options: string[];
        correct_answer: string;
        explanation: string;
    };
}

export default function ModulePage() {
    const params = useParams();
    const router = useRouter();
    const searchParams = useSearchParams();
    const topic = decodeURIComponent(params.topic as string);
    const moduleIndex = parseInt(params.moduleIndex as string);
    const isReviewMode = searchParams.get("completed") === "true";

    const [loading, setLoading] = useState(true);
    const [moduleName, setModuleName] = useState("");
    const [content, setContent] = useState<ModuleContent | null>(null);
    const [isPracticeOpen, setIsPracticeOpen] = useState(false);
    const [showTip, setShowTip] = useState(false);
    const [tip, setTip] = useState("");

    useEffect(() => {
        async function fetchModuleData() {
            try {
                // 1. Get module name from learning path
                const { data: pathData, error: pathError } = await supabase
                    .from('learning_paths')
                    .select('analysis_json')
                    .eq('topic', topic)
                    .order('created_at', { ascending: false })
                    .limit(1)
                    .single();

                if (pathError || !pathData) {
                    console.error("Error fetching path:", pathError);
                    return;
                }

                const modules = pathData.analysis_json.learning_path;
                if (moduleIndex >= modules.length) {
                    router.push(`/dashboard/${encodeURIComponent(topic)}`);
                    return;
                }

                const currentModule = modules[moduleIndex];
                setModuleName(currentModule.step);

                // 2. Generate content via AI
                const generatedContent = await generateModuleContent(topic, currentModule.step);
                if (generatedContent) {
                    setContent(generatedContent);
                }
            } catch (error) {
                console.error("Error:", error);
            } finally {
                setLoading(false);
            }
        }

        if (topic) {
            fetchModuleData();
        }
    }, [topic, moduleIndex, router]);

    const handleMarkComplete = async () => {
        // Trigger Confetti
        confetti({
            particleCount: 100,
            spread: 70,
            origin: { y: 0.6 },
            colors: ['#6366f1', '#ec4899', '#10b981']
        });

        // Generate Tip
        const generatedTip = await generateModuleTips(topic, moduleName);
        if (generatedTip) {
            setTip(generatedTip);
            setShowTip(true);
        }

        // Update Supabase
        const dummyUserId = "00000000-0000-0000-0000-000000000000";
        try {
            await supabase.from('module_progress').upsert({
                user_id: dummyUserId,
                module_id: moduleName,
                completed: true,
                completed_at: new Date().toISOString()
            });
        } catch (err) {
            console.error("Failed to save progress:", err);
        }

        // Redirect after delay if no tip, or let user click "Continue" on tip modal
        if (!generatedTip) {
            setTimeout(() => {
                router.push(`/dashboard/${encodeURIComponent(topic)}`);
            }, 2000);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-[#030303] flex items-center justify-center">
                <div className="text-center">
                    <Loader2 className="w-8 h-8 text-indigo-500 animate-spin mx-auto mb-4" />
                    <p className="text-white/60">Generating your lesson...</p>
                </div>
            </div>
        );
    }

    if (!content) {
        return (
            <div className="min-h-screen bg-[#030303] flex items-center justify-center text-white">
                <p>Failed to load content. Please try again.</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#030303] text-white relative">
            <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/[0.05] via-transparent to-rose-500/[0.05] blur-3xl pointer-events-none" />

            <main className="container mx-auto px-4 py-8 max-w-4xl relative z-10">
                <header className="mb-8">
                    <button
                        onClick={() => router.push(`/dashboard/${encodeURIComponent(topic)}`)}
                        className="flex items-center gap-2 text-white/40 hover:text-white mb-6 transition-colors"
                    >
                        <ArrowLeft className="w-4 h-4" /> Back to Dashboard
                    </button>

                    <div className="flex items-center justify-between">
                        <div>
                            <div className="flex items-center gap-3 mb-2 text-indigo-400 text-sm font-medium uppercase tracking-wider">
                                <BookOpen className="w-4 h-4" />
                                {topic}
                            </div>
                            <h1 className="text-3xl md:text-4xl font-bold mb-4">{moduleName}</h1>
                        </div>
                        <div className="flex items-center gap-3">
                            <button
                                onClick={() => setIsPracticeOpen(true)}
                                className="px-4 py-2 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-sm font-semibold flex items-center gap-2 hover:bg-indigo-500/20 transition-colors"
                            >
                                <Sparkles className="w-4 h-4" /> Practice Quiz
                            </button>
                            {isReviewMode && (
                                <div className="px-4 py-2 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-sm font-semibold flex items-center gap-2">
                                    <CheckCircle2 className="w-4 h-4" /> Review Mode
                                </div>
                            )}
                        </div>
                    </div>
                </header>

                <div className="grid gap-8">
                    {/* Explanation Section */}
                    <section className="bg-white/[0.03] border border-white/10 rounded-2xl p-6 md:p-8">
                        <div className="prose prose-invert max-w-none">
                            <ReactMarkdown>{content.explanation}</ReactMarkdown>
                        </div>
                    </section>

                    {/* Code Snippet Section */}
                    <section className="bg-[#0A0A0A] border border-white/10 rounded-2xl overflow-hidden">
                        <div className="flex items-center gap-2 px-4 py-3 bg-white/5 border-b border-white/10">
                            <Code2 className="w-4 h-4 text-white/60" />
                            <span className="text-sm text-white/60 font-mono">Example Code</span>
                        </div>
                        <div className="p-6 overflow-x-auto">
                            <pre className="font-mono text-sm text-emerald-300">
                                <code>{content.code_snippet}</code>
                            </pre>
                        </div>
                    </section>

                    {/* Actions */}
                    <div className="flex flex-col sm:flex-row gap-4 justify-end items-center pt-8 border-t border-white/10">
                        {!isReviewMode ? (
                            <button
                                onClick={() => setIsPracticeOpen(true)}
                                className="flex items-center gap-2 px-8 py-3 rounded-full bg-white text-black font-bold hover:bg-white/90 transition-colors w-full sm:w-auto justify-center"
                            >
                                <Play className="w-4 h-4" /> Take Quiz to Complete
                            </button>
                        ) : (
                            <div className="flex gap-4 w-full sm:w-auto">
                                <button
                                    onClick={() => setIsPracticeOpen(true)}
                                    className="flex items-center gap-2 px-6 py-3 rounded-full bg-white/10 text-white font-semibold hover:bg-white/20 transition-colors w-full sm:w-auto justify-center"
                                >
                                    <Play className="w-4 h-4" /> Practice Again
                                </button>
                                <button
                                    disabled
                                    className="flex items-center gap-2 px-8 py-3 rounded-full bg-white/5 text-white/40 font-bold cursor-not-allowed w-full sm:w-auto justify-center"
                                >
                                    Completed <CheckCircle2 className="w-5 h-5" />
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </main>

            <PracticeModal
                isOpen={isPracticeOpen}
                onClose={() => setIsPracticeOpen(false)}
                question={content.practice_question}
                onComplete={() => {
                    setIsPracticeOpen(false);
                    if (!isReviewMode) {
                        handleMarkComplete();
                    }
                }}
            />

            {/* AI Tip Modal */}
            <AnimatePresence>
                {showTip && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="absolute inset-0 bg-black/80 backdrop-blur-sm"
                        />
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9, y: 20 }}
                            className="relative w-full max-w-md bg-[#0A0A0A] border border-white/10 rounded-2xl p-6 shadow-2xl overflow-hidden"
                        >
                            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-indigo-500 to-rose-500" />

                            <div className="flex flex-col items-center text-center mb-6">
                                <div className="w-12 h-12 rounded-full bg-indigo-500/10 flex items-center justify-center mb-4">
                                    <Sparkles className="w-6 h-6 text-indigo-400" />
                                </div>
                                <h3 className="text-2xl font-bold text-white mb-2">Module Completed!</h3>
                                <p className="text-white/60">You're making great progress.</p>
                            </div>

                            <div className="bg-white/5 rounded-xl p-4 mb-6 border border-white/10">
                                <div className="flex items-start gap-3">
                                    <Lightbulb className="w-5 h-5 text-yellow-400 flex-shrink-0 mt-0.5" />
                                    <p className="text-sm text-white/80 leading-relaxed italic">
                                        "{tip}"
                                    </p>
                                </div>
                            </div>

                            <button
                                onClick={() => router.push(`/dashboard/${encodeURIComponent(topic)}`)}
                                className="w-full py-3 rounded-xl bg-white text-black font-bold hover:bg-white/90 transition-colors"
                            >
                                Continue to Dashboard
                            </button>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
}

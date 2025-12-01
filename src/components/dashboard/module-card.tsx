"use client";

import { motion } from "framer-motion";
import { CheckCircle2, Lock, Play, Star, AlertTriangle } from "lucide-react";
import { cn } from "@/lib/utils";

interface ModuleCardProps {
    module: {
        step: string;
        description: string;
        difficulty?: "Easy" | "Medium" | "Hard"; // Optional if not in AI response yet
        status: "locked" | "available" | "completed";
        badge?: "strength" | "weakness" | "recommended";
    };
    index: number;
    onStart: () => void;
}

export function ModuleCard({ module, index, onStart }: ModuleCardProps) {
    const isLocked = module.status === "locked";
    const isCompleted = module.status === "completed";

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className={cn(
                "group relative p-6 rounded-2xl border transition-all duration-300",
                isLocked
                    ? "bg-white/[0.02] border-white/5 opacity-60"
                    : "bg-white/[0.05] border-white/10 hover:bg-white/[0.08] hover:border-white/20"
            )}
        >
            <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                        <span className={cn(
                            "flex items-center justify-center w-8 h-8 rounded-full text-xs font-bold border",
                            isCompleted ? "bg-emerald-500/20 border-emerald-500/50 text-emerald-400" :
                                isLocked ? "bg-white/5 border-white/10 text-white/30" :
                                    "bg-indigo-500/20 border-indigo-500/50 text-indigo-400"
                        )}>
                            {index + 1}
                        </span>

                        {module.badge === "strength" && (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 text-xs font-medium border border-emerald-500/20">
                                <CheckCircle2 className="w-3 h-3" /> Strength
                            </span>
                        )}
                        {module.badge === "weakness" && (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-400 text-xs font-medium border border-amber-500/20">
                                <AlertTriangle className="w-3 h-3" /> Focus Area
                            </span>
                        )}
                        {module.badge === "recommended" && (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-yellow-500/10 text-yellow-400 text-xs font-medium border border-yellow-500/20">
                                <Star className="w-3 h-3" /> Recommended
                            </span>
                        )}
                    </div>

                    <h3 className={cn("text-lg font-semibold mb-2", isLocked ? "text-white/50" : "text-white")}>
                        {module.step}
                    </h3>
                    <p className="text-sm text-white/50 leading-relaxed mb-4">
                        {module.description}
                    </p>

                    <div className="flex items-center gap-4">
                        {module.difficulty && (
                            <span className={cn(
                                "text-xs px-2 py-1 rounded-md border",
                                module.difficulty === "Easy" ? "border-emerald-500/20 text-emerald-400 bg-emerald-500/5" :
                                    module.difficulty === "Medium" ? "border-yellow-500/20 text-yellow-400 bg-yellow-500/5" :
                                        "border-rose-500/20 text-rose-400 bg-rose-500/5"
                            )}>
                                {module.difficulty}
                            </span>
                        )}
                    </div>
                </div>

                <div className="flex flex-col items-end justify-between self-stretch">
                    {isCompleted ? (
                        <div className="w-10 h-10 rounded-full bg-emerald-500/20 flex items-center justify-center text-emerald-400">
                            <CheckCircle2 className="w-6 h-6" />
                        </div>
                    ) : isLocked ? (
                        <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-white/20">
                            <Lock className="w-5 h-5" />
                        </div>
                    ) : (
                        <button
                            onClick={onStart}
                            className="w-10 h-10 rounded-full bg-white text-black flex items-center justify-center hover:scale-110 transition-transform"
                        >
                            <Play className="w-5 h-5 ml-0.5" />
                        </button>
                    )}
                </div>
            </div>

            {!isLocked && !isCompleted && (
                <div className="mt-4 pt-4 border-t border-white/5 flex justify-end">
                    <button
                        onClick={onStart}
                        className="text-sm font-medium text-white hover:text-indigo-400 transition-colors flex items-center gap-2"
                    >
                        Start Module <Play className="w-3 h-3" />
                    </button>
                </div>
            )}
        </motion.div>
    );
}

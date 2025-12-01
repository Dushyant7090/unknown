"use client";

import { motion } from "framer-motion";

interface DashboardProgressProps {
    completedModules: number;
    totalModules: number;
}

export function DashboardProgress({ completedModules, totalModules }: DashboardProgressProps) {
    const progress = Math.round((completedModules / totalModules) * 100) || 0;

    return (
        <div className="w-full bg-white/[0.03] border-b border-white/10 sticky top-0 z-50 backdrop-blur-xl">
            <div className="container mx-auto px-4 py-4">
                <div className="flex items-center justify-between mb-2 text-sm">
                    <span className="text-white/60 font-medium">Course Progress</span>
                    <span className="text-white font-bold">{progress}%</span>
                </div>
                <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
                    <motion.div
                        className="h-full bg-gradient-to-r from-indigo-500 via-purple-500 to-rose-500"
                        initial={{ width: 0 }}
                        animate={{ width: `${progress}%` }}
                        transition={{ duration: 1, ease: "easeOut" }}
                    />
                </div>
            </div>
        </div>
    );
}

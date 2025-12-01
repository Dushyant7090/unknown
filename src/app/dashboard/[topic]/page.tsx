"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { ArrowLeft, Loader2, BookOpen } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { ModuleCard } from "@/components/dashboard/module-card";
import { DashboardProgress } from "@/components/dashboard/dashboard-progress";

interface Module {
    step: string;
    description: string;
    difficulty?: "Easy" | "Medium" | "Hard";
    status: "locked" | "available" | "completed";
    badge?: "strength" | "weakness" | "recommended";
}

interface LearningPath {
    analysis_json: {
        learning_path: { step: string; description: string }[];
        strengths: string[];
        weaknesses: string[];
    };
}

export default function DashboardPage() {
    const params = useParams();
    const router = useRouter();
    const topic = decodeURIComponent(params.topic as string);

    const [loading, setLoading] = useState(true);
    const [modules, setModules] = useState<Module[]>([]);
    const [completedCount, setCompletedCount] = useState(0);

    useEffect(() => {
        async function fetchLearningPath() {
            try {
                // 1. Fetch the learning path for this topic
                // In a real app, we'd filter by user_id too
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

                const learningPath = pathData.analysis_json.learning_path;
                const strengths = pathData.analysis_json.strengths || [];
                const weaknesses = pathData.analysis_json.weaknesses || [];

                // 2. Fetch progress
                const dummyUserId = "00000000-0000-0000-0000-000000000000";
                const { data: progressData } = await supabase
                    .from('module_progress')
                    .select('module_id')
                    .eq('user_id', dummyUserId)
                    .eq('completed', true);

                const completedModuleIds = new Set(progressData?.map(p => p.module_id) || []);
                setCompletedCount(completedModuleIds.size);

                // 3. Map to Module interface
                const mappedModules: Module[] = learningPath.map((step: any, index: number) => {
                    const isCompleted = completedModuleIds.has(step.step);
                    // First module is always available if not completed.
                    // Subsequent modules are available only if the previous one is completed.
                    const isAvailable = index === 0 || completedModuleIds.has(learningPath[index - 1].step);

                    let status: "locked" | "available" | "completed" = "locked";
                    if (isCompleted) status = "completed";
                    else if (isAvailable) status = "available";

                    // Determine badge
                    let badge: "strength" | "weakness" | "recommended" | undefined;
                    if (strengths.some((s: string) => step.step.includes(s) || step.description.includes(s))) badge = "strength";
                    if (weaknesses.some((w: string) => step.step.includes(w) || step.description.includes(w))) badge = "weakness";
                    if (index === 0 && !isCompleted) badge = "recommended";

                    return {
                        step: step.step,
                        description: step.description,
                        difficulty: "Medium", // Default, could be enhanced
                        status,
                        badge
                    };
                });

                setModules(mappedModules);
            } catch (error) {
                console.error("Error:", error);
            } finally {
                setLoading(false);
            }
        }

        if (topic) {
            fetchLearningPath();
        }
    }, [topic]);

    const handleStartModule = (index: number) => {
        const module = modules[index];
        const isCompleted = module.status === "completed";
        router.push(`/learn/${encodeURIComponent(topic)}/${index}${isCompleted ? '?completed=true' : ''}`);
    };

    return (
        <div className="min-h-screen bg-[#030303] text-white">
            <DashboardProgress completedModules={completedCount} totalModules={modules.length} />

            <main className="container mx-auto px-4 py-8 max-w-4xl">
                <header className="mb-12">
                    <button
                        onClick={() => router.push('/')}
                        className="flex items-center gap-2 text-white/40 hover:text-white mb-6 transition-colors"
                    >
                        <ArrowLeft className="w-4 h-4" /> Back to Home
                    </button>

                    <div className="flex items-center gap-4 mb-4">
                        <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 flex items-center justify-center border border-indigo-500/20">
                            <BookOpen className="w-6 h-6 text-indigo-400" />
                        </div>
                        <h1 className="text-3xl font-bold">{topic}</h1>
                    </div>
                    <p className="text-white/60 text-lg max-w-2xl">
                        Your personalized learning path is ready. Start with the recommended modules to build a strong foundation.
                    </p>
                </header>

                <div className="space-y-4">
                    {modules.map((module, index) => (
                        <ModuleCard
                            key={index}
                            module={module}
                            index={index}
                            onStart={() => handleStartModule(index)}
                        />
                    ))}
                </div>
            </main>
        </div>
    );
}

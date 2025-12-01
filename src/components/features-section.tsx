"use client";

import { motion } from "framer-motion";
import { Brain, Target, BarChart3, Trophy } from "lucide-react";
import { cn } from "@/lib/utils";

const features = [
    {
        title: "AI-Generated Learning Path",
        description: "Get a step-by-step roadmap designed specifically for your goals and skill level.",
        icon: <Brain className="w-6 h-6 text-indigo-400" />,
        gradient: "from-indigo-500/20 to-indigo-500/0",
    },
    {
        title: "5-Minute Diagnostic Test",
        description: "A short assessment that instantly identifies learning gaps and strengths.",
        icon: <Target className="w-6 h-6 text-rose-400" />,
        gradient: "from-rose-500/20 to-rose-500/0",
    },
    {
        title: "Personal Skill Graph",
        description: "Visualize your progress and track mastery across all topics.",
        icon: <BarChart3 className="w-6 h-6 text-violet-400" />,
        gradient: "from-violet-500/20 to-violet-500/0",
    },
    {
        title: "Smart Progress Tracking",
        description: "Stay motivated with milestones, scores, streaks, and achievements.",
        icon: <Trophy className="w-6 h-6 text-amber-400" />,
        gradient: "from-amber-500/20 to-amber-500/0",
    },
];

export function FeaturesSection() {
    return (
        <section className="py-24 bg-[#030303] relative overflow-hidden">
            <div className="container mx-auto px-4 md:px-6 relative z-10">
                <div className="text-center mb-16">
                    <h2 className="text-3xl md:text-5xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-b from-white to-white/60">
                        Everything You Need to Learn Smarter
                    </h2>
                    <p className="text-white/40 text-lg max-w-2xl mx-auto">
                        Our AI analyzes your learning style to create the perfect curriculum for you.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-5xl mx-auto">
                    {features.map((feature, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: index * 0.1 }}
                            viewport={{ once: true }}
                            className="group relative p-8 rounded-3xl bg-white/[0.03] border border-white/[0.08] hover:bg-white/[0.05] transition-colors overflow-hidden"
                        >
                            <div className={cn("absolute inset-0 bg-gradient-to-br opacity-0 group-hover:opacity-100 transition-opacity duration-500", feature.gradient)} />

                            <div className="relative z-10">
                                <div className="mb-6 p-3 rounded-2xl bg-white/[0.05] w-fit border border-white/[0.1]">
                                    {feature.icon}
                                </div>
                                <h3 className="text-xl font-semibold text-white mb-3">
                                    {feature.title}
                                </h3>
                                <p className="text-white/40 leading-relaxed">
                                    {feature.description}
                                </p>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}

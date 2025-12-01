"use client";

import { motion } from "framer-motion";
import { Check } from "lucide-react";

interface ProgressBarProps {
    currentStep: number;
    totalSteps: number;
}

const steps = ["Education", "Degree", "Subject", "Topics", "Diagnostic"];

export function ProgressBar({ currentStep, totalSteps }: ProgressBarProps) {
    return (
        <div className="w-full max-w-4xl mx-auto mb-12 px-4">
            <div className="relative flex justify-between">
                {/* Background Line */}
                <div className="absolute top-1/2 left-0 w-full h-1 bg-white/10 -translate-y-1/2 rounded-full -z-10" />

                {/* Active Line */}
                <motion.div
                    className="absolute top-1/2 left-0 h-1 bg-indigo-500 -translate-y-1/2 rounded-full -z-10"
                    initial={{ width: "0%" }}
                    animate={{ width: `${((currentStep - 1) / (totalSteps - 1)) * 100}%` }}
                    transition={{ duration: 0.5, ease: "easeInOut" }}
                />

                {steps.map((step, index) => {
                    const stepNum = index + 1;
                    const isActive = stepNum <= currentStep;
                    const isCompleted = stepNum < currentStep;

                    return (
                        <div key={step} className="flex flex-col items-center gap-2">
                            <motion.div
                                className={`w-8 h-8 rounded-full flex items-center justify-center border-2 transition-colors duration-300 ${isActive
                                        ? "bg-indigo-500 border-indigo-500 text-white"
                                        : "bg-[#030303] border-white/20 text-white/40"
                                    }`}
                                initial={false}
                                animate={{
                                    scale: isActive ? 1.1 : 1,
                                    backgroundColor: isActive ? "#6366f1" : "#030303",
                                    borderColor: isActive ? "#6366f1" : "rgba(255,255,255,0.2)",
                                }}
                            >
                                {isCompleted ? (
                                    <Check className="w-4 h-4" />
                                ) : (
                                    <span className="text-xs font-bold">{stepNum}</span>
                                )}
                            </motion.div>
                            <span
                                className={`text-xs font-medium hidden md:block transition-colors duration-300 ${isActive ? "text-white" : "text-white/40"
                                    }`}
                            >
                                {step}
                            </span>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}

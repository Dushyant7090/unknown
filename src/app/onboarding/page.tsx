"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { ProgressBar } from "@/components/onboarding/progress-bar";
import { StepEducation } from "@/components/onboarding/step-education";
import { StepDegree } from "@/components/onboarding/step-degree";
import { StepSubject } from "@/components/onboarding/step-subject";
import { StepTopics } from "@/components/onboarding/step-topics";

export default function OnboardingPage() {
    const router = useRouter();
    const [step, setStep] = useState(1);
    const [formData, setFormData] = useState({
        educationLevel: "",
        degree: "",
        subject: "",
        topic: "",
    });

    const nextStep = () => setStep((s) => s + 1);
    const prevStep = () => setStep((s) => Math.max(1, s - 1));

    const handleEducationSelect = (level: string) => {
        setFormData({ ...formData, educationLevel: level });
        nextStep();
    };

    const handleDegreeSelect = (degree: string) => {
        setFormData({ ...formData, degree });
        nextStep();
    };

    const handleSubjectSelect = (subject: string) => {
        setFormData({ ...formData, subject });
        nextStep();
    };

    const handleTopicSelect = (topic: string) => {
        setFormData({ ...formData, topic });
        // Redirect to diagnostic page with topic
        router.push(`/diagnostic?topic=${encodeURIComponent(topic)}`);
    };

    return (
        <div className="min-h-screen bg-[#030303] text-white flex flex-col relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/[0.05] via-transparent to-rose-500/[0.05] blur-3xl pointer-events-none" />

            <main className="flex-1 container mx-auto px-4 py-8 relative z-10 flex flex-col min-h-screen">
                {/* Header */}
                <header className="flex justify-between items-center mb-8">
                    <div className="text-xl font-bold tracking-tighter">PathMind AI</div>
                    <button
                        onClick={() => router.push("/diagnostic")}
                        className="text-sm text-white/40 hover:text-white transition-colors"
                    >
                        Skip Onboarding
                    </button>
                </header>

                <ProgressBar currentStep={step} totalSteps={5} />

                <div className="flex-1 flex flex-col justify-center pb-20">
                    <AnimatePresence mode="wait">
                        {step === 1 && (
                            <motion.div
                                key="step1"
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                transition={{ duration: 0.3 }}
                            >
                                <StepEducation onSelect={handleEducationSelect} />
                            </motion.div>
                        )}
                        {step === 2 && (
                            <motion.div
                                key="step2"
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                transition={{ duration: 0.3 }}
                            >
                                <StepDegree
                                    educationLevel={formData.educationLevel}
                                    onSelect={handleDegreeSelect}
                                    onBack={prevStep}
                                />
                            </motion.div>
                        )}
                        {step === 3 && (
                            <motion.div
                                key="step3"
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                transition={{ duration: 0.3 }}
                            >
                                <StepSubject
                                    degree={formData.degree}
                                    onSelect={handleSubjectSelect}
                                    onBack={prevStep}
                                />
                            </motion.div>
                        )}
                        {step === 4 && (
                            <motion.div
                                key="step4"
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                transition={{ duration: 0.3 }}
                            >
                                <StepTopics
                                    subject={formData.subject}
                                    onSelect={handleTopicSelect}
                                    onBack={prevStep}
                                />
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </main>
        </div>
    );
}

"use client";

import { motion } from "framer-motion";

export function CTASection() {
    return (
        <section className="py-24 bg-[#030303] relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-t from-indigo-500/[0.1] via-transparent to-transparent" />

            <div className="container mx-auto px-4 md:px-6 relative z-10">
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5 }}
                    viewport={{ once: true }}
                    className="max-w-4xl mx-auto text-center p-12 md:p-20 rounded-[2.5rem] bg-gradient-to-br from-white/[0.05] to-white/[0.02] border border-white/[0.08] backdrop-blur-sm"
                >
                    <h2 className="text-4xl md:text-6xl font-bold mb-6 text-white tracking-tight">
                        Ready to Learn Smarter?
                    </h2>
                    <p className="text-lg md:text-xl text-white/60 mb-10 max-w-2xl mx-auto">
                        Join thousands of students improving their skills every day with PathAI Tutor.
                    </p>
                    <button className="px-10 py-4 rounded-full bg-white text-black font-bold text-lg hover:bg-white/90 transition-colors shadow-[0_0_40px_-10px_rgba(255,255,255,0.3)]">
                        Start Learning Free
                    </button>
                </motion.div>
            </div>
        </section>
    );
}

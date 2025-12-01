import { Github, Twitter, Linkedin } from "lucide-react";

export function Footer() {
    return (
        <footer className="bg-[#030303] border-t border-white/[0.08] py-16">
            <div className="container mx-auto px-4 md:px-6">
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-10 mb-16">
                    <div className="col-span-2 lg:col-span-2">
                        <h3 className="text-2xl font-bold text-white mb-4">PathAI Tutor</h3>
                        <p className="text-white/40 max-w-sm mb-6">
                            Your personalized AI tutor that builds a custom learning path just for you.
                        </p>
                        <div className="flex gap-4">
                            <a href="#" className="text-white/40 hover:text-white transition-colors">
                                <Twitter className="w-5 h-5" />
                            </a>
                            <a href="#" className="text-white/40 hover:text-white transition-colors">
                                <Linkedin className="w-5 h-5" />
                            </a>
                            <a href="#" className="text-white/40 hover:text-white transition-colors">
                                <Github className="w-5 h-5" />
                            </a>
                        </div>
                    </div>

                    <div>
                        <h4 className="text-white font-semibold mb-6">Product</h4>
                        <ul className="space-y-4">
                            <li><a href="#" className="text-white/40 hover:text-white transition-colors">Features</a></li>
                            <li><a href="#" className="text-white/40 hover:text-white transition-colors">Pricing</a></li>
                            <li><a href="#" className="text-white/40 hover:text-white transition-colors">Demo</a></li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="text-white font-semibold mb-6">Company</h4>
                        <ul className="space-y-4">
                            <li><a href="#" className="text-white/40 hover:text-white transition-colors">About</a></li>
                            <li><a href="#" className="text-white/40 hover:text-white transition-colors">Blog</a></li>
                            <li><a href="#" className="text-white/40 hover:text-white transition-colors">Careers</a></li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="text-white font-semibold mb-6">Resources</h4>
                        <ul className="space-y-4">
                            <li><a href="#" className="text-white/40 hover:text-white transition-colors">Help Center</a></li>
                            <li><a href="#" className="text-white/40 hover:text-white transition-colors">Contact</a></li>
                            <li><a href="#" className="text-white/40 hover:text-white transition-colors">Privacy</a></li>
                        </ul>
                    </div>
                </div>

                <div className="pt-8 border-t border-white/[0.08] flex flex-col md:flex-row justify-between items-center gap-4">
                    <p className="text-white/20 text-sm">
                        © 2024 PathAI Tutor. All rights reserved.
                    </p>
                    <div className="flex gap-8">
                        <a href="#" className="text-white/20 hover:text-white transition-colors text-sm">Terms</a>
                        <a href="#" className="text-white/20 hover:text-white transition-colors text-sm">Privacy</a>
                    </div>
                </div>
            </div>
        </footer>
    );
}

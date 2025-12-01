import { HeroGeometric } from "@/components/ui/shape-landing-hero";
import { FeaturesSection } from "@/components/features-section";
import { TestimonialsSection } from "@/components/testimonials-section";
import { CTASection } from "@/components/cta-section";
import { Footer } from "@/components/footer";

export default function Home() {
    return (
        <main className="min-h-screen bg-[#030303] overflow-x-hidden">
            <HeroGeometric
                badge="PathAI Tutor"
                title1="Your AI Tutor That"
                title2="Builds Your Learning Path"
            />
            <FeaturesSection />
            <TestimonialsSection />
            <CTASection />
            <Footer />
        </main>
    );
}

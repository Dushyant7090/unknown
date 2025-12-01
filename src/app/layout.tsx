import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
    title: "PathAI Tutor - Your AI Learning Journey",
    description: "Stop random studying. Start learning smarter with your personalized AI-powered learning journey.",
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en" className="dark">
            <body className={`${inter.className} bg-[#030303] text-white antialiased`}>
                {children}
            </body>
        </html>
    );
}

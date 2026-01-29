import { Inter } from "next/font/google";
import "./globals.css";
import { Sidebar } from "@/components/Sidebar";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
    title: "Hive Dashboard",
    description: "Monitor your AI Agents",
};

export default function RootLayout({
    children,
}) {
    return (
        <html lang="en">
            <body className={`${inter.className} bg-slate-50 text-slate-900`}>
                <div className="flex h-screen overflow-hidden">
                    <Sidebar />
                    <main className="flex-1 overflow-auto">
                        <div className="p-8 max-w-7xl mx-auto">
                            {children}
                        </div>
                    </main>
                </div>
            </body>
        </html>
    );
}

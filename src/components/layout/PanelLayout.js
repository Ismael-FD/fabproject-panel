"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { isAuthenticated } from "@/lib/auth";
import Sidebar from "./Sidebar";
import { Skeleton } from "@/components/ui/Skeleton";
import { Menu } from "lucide-react";

export default function PanelLayout({ children }) {
    const router = useRouter();
    const [isAuth, setIsAuth] = useState(false);
    const [mounted, setMounted] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    useEffect(() => {
        // Check auth status after mounting
        const authStatus = isAuthenticated();
        setIsAuth(authStatus);
        setMounted(true);
        
        // Redirect if not authenticated
        if (!authStatus) {
            router.push("/login");
        }
    }, [router]);

    // Prevent flash of unauthenticated content
    if (!mounted) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-900">
                <div className="w-full max-w-7xl mx-auto p-6 space-y-6">
                    <div className="flex items-center gap-4">
                        <Skeleton className="w-16 h-16 rounded-2xl" />
                        <Skeleton className="w-48 h-8 rounded-lg" />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        <Skeleton className="h-24 rounded-2xl" />
                        <Skeleton className="h-24 rounded-2xl" />
                        <Skeleton className="h-24 rounded-2xl" />
                        <Skeleton className="h-24 rounded-2xl" />
                    </div>
                    <Skeleton className="h-64 rounded-2xl" />
                </div>
            </div>
        );
    }

    if (!isAuth) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-900">
                <div className="w-full max-w-7xl mx-auto p-6 space-y-6">
                    <div className="flex items-center gap-4">
                        <Skeleton className="w-16 h-16 rounded-2xl" />
                        <Skeleton className="w-48 h-8 rounded-lg" />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        <Skeleton className="h-24 rounded-2xl" />
                        <Skeleton className="h-24 rounded-2xl" />
                        <Skeleton className="h-24 rounded-2xl" />
                        <Skeleton className="h-24 rounded-2xl" />
                    </div>
                    <Skeleton className="h-64 rounded-2xl" />
                </div>
            </div>
        );
    }

    return (
        <div className="flex h-screen bg-gray-900 overflow-hidden relative">
            <Sidebar isOpen={mobileMenuOpen} onClose={() => setMobileMenuOpen(false)} />
            
            {/* Mobile menu button */}
            <button
                onClick={() => setMobileMenuOpen((open) => !open)}
                className="lg:hidden fixed top-4 left-4 z-50 p-3 bg-gray-800 border border-gray-700 rounded-2xl text-gray-300 hover:text-white hover:bg-gray-700 transition-all shadow-apple"
            >
                <Menu className="w-5 h-5" />
            </button>
            
            <main className="flex-1 overflow-y-auto transition-all duration-500 lg:ml-28">
                <div className="p-4 sm:p-6 md:p-8 max-w-7xl mx-auto animate-fade-in">
                    {/* Mobile header */}
                    <div className="lg:hidden mb-6">
                        <h1 className="text-2xl font-bold text-white">Panel de Control</h1>
                    </div>
                    {children}
                </div>
            </main>
        </div>
    );
}

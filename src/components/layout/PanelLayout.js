"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { isAuthenticated } from "@/lib/auth";
import Sidebar from "./Sidebar";

export default function PanelLayout({ children }) {
    const router = useRouter();
    const [mounted, setMounted] = useState(false);
    const [authorized, setAuthorized] = useState(false);

    useEffect(() => {
        setMounted(true);
        // Check if user is authenticated
        if (!isAuthenticated()) {
            router.push("/login");
        } else {
            setAuthorized(true);
        }
    }, [router]);

    // Prevent flash of unauthenticated content
    if (!mounted || !authorized) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-neutral-50">
                <div className="relative">
                    <div className="w-12 h-12 rounded-full border-2 border-neutral-200 border-t-blue-550 animate-spin"></div>
                    <div className="absolute inset-0 w-12 h-12 rounded-full border-2 border-transparent border-b-blue-100 animate-spin animation-delay-150"></div>
                </div>
            </div>
        );
    }

    return (
        <div className="flex h-screen bg-neutral-50 overflow-hidden">
            <Sidebar />
            <main className="flex-1 overflow-y-auto">
                <div className="p-6 md:p-8 max-w-7xl mx-auto animate-fade-in">{children}</div>
            </main>
        </div>
    );
}

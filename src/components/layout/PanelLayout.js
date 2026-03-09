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
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    return (
        <div className="flex h-screen bg-gray-50 overflow-hidden">
            <Sidebar />
            <main className="flex-1 overflow-y-auto">
                <div className="p-8 max-w-7xl mx-auto">{children}</div>
            </main>
        </div>
    );
}

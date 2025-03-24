"use client";

import React from "react";
import { usePathname } from "next/navigation";
import { MainNav } from "@/components/main-nav";
import CustomNav from "@/components/custom/main-nav";
import { SiteFooter } from "@/components/site-footer";

export default function ClientLayout({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const isCustomNav = pathname.includes("/donors") || pathname.includes("/organizations");

    return (
        <div className="relative flex min-h-screen flex-col">
            {isCustomNav ? <CustomNav /> : <MainNav />}
            <main className="flex-1">{children}</main>
            <SiteFooter />
        </div>
    );
}

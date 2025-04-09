"use client";

import React from "react";
import { usePathname } from "next/navigation";
import { MainNav } from "@/components/main-nav";
import CustomNav from "@/components/custom/main-nav";
import { SiteFooter } from "@/components/site-footer";

export default function ClientLayout({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const isCustomNav = pathname.includes("/donors") || pathname.includes("/organizations");
    const hideNavAndFooter = pathname === "/register" || pathname === "/login" || pathname === "/create-profile" || pathname === "/kyb-form";

    return (
        <div className="relative flex min-h-screen flex-col">
            {!hideNavAndFooter && (isCustomNav ? <CustomNav /> : <MainNav />)}
            <main className="flex-1">{children}</main>
            {!hideNavAndFooter && <SiteFooter />}
        </div>
    );
}

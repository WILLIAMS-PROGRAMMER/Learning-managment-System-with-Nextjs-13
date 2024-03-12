"use client"

import { UserButton, useAuth } from "@clerk/nextjs";
import { usePathname } from "next/navigation";
import { Button } from "./ui/button";
import { LogOut } from "lucide-react";
import Link from "next/link";
import SearchInput from "./search-input";
import { isTeacher } from "@/lib/teacher";

const NavBarRoutes = () => {
    const {userId} = useAuth();
    const pathname = usePathname();
    

    const isTeacherPage = pathname?.startsWith("/teacher");
    const isPlayerPage = pathname?.startsWith("/courses"); //cuando vas a las seccion de ver videos
    const isSearchPage = pathname?.startsWith("/search");
    
    // ml-auto es para que se alinee a la derecha
    return ( 
        <>
        {isSearchPage && (
            <div className="hidden md:block">
                <SearchInput />
            </div>
        
        )}
            <div className="flex gap-x-2 ml-auto">
                {(isTeacherPage || isPlayerPage) ? (
                    <Link href="/">
                        <Button size="sm" variant="ghost">
                            <LogOut className="h-4 w-4 mr-2" />
                            Exit
                        </Button>
                    </Link>
                ): isTeacher(userId) ? (
                    <Link href="/teacher/courses">
                        <Button size="sm" variant="ghost">
                            Teacher mode
                        </Button>
                    </Link>
                ): null}
                <UserButton 
                    afterSignOutUrl="/"
                />
            </div>
        </>
     );
}
 
export default NavBarRoutes;
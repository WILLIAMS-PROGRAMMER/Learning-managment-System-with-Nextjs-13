import {Menu} from "lucide-react";

import {
    Sheet,
    SheetContent,
    SheetTrigger
} from "@/components/ui/sheet";
import { CourseSidebar } from "./CourseSidebar";


interface CourseMobileSidebarProps {
    course: any;
    progressCount: number;
};

export const CourseMobileSidebar = ({course, progressCount}: CourseMobileSidebarProps) => {
    return (
        <Sheet>
            <SheetTrigger className="md:hidden pr-4 hover:opacity-75 transition">
                <Menu size={24} />
            </SheetTrigger>

            <SheetContent side="left" className="p-0 bg-white w-72">
                <CourseSidebar course={course} progressCount={progressCount} />
            </SheetContent>
        </Sheet>
    );
}
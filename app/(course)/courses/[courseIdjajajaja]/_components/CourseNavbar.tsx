import NavBarRoutes from "@/components/NavBarRoutes";
import { CourseMobileSidebar } from "./CourseMobileSidebar";


interface CourseNavbarProps {
    course: any;
    progressCount: number;
}

export const CourseNavbar = ({course, progressCount}: CourseNavbarProps) => {
    return (
        <div className="p-4 border-b h-full flex items-center bg-white shadow-sm">
            <CourseMobileSidebar course={course} progressCount={progressCount} />
            <NavBarRoutes/>
        </div>
    )
};
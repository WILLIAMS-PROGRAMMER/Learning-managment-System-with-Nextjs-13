import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs";
import { Chapter, Course,UserProgress } from "@prisma/client";
import { redirect } from "next/navigation";
import { CourseSidebarItem } from "./CourseSidebarItem";
import { CourseProgress } from "@/components/CourseProgress";



interface CourseSidebarProps {
    course: Course & {
        chapters: (Chapter & {
            userProgress: UserProgress[] | null;
        })[]; //chapters is an array of Chapter
    };
    progressCount: number;
}

export const CourseSidebar = async ({course, progressCount}:CourseSidebarProps) => {

    const {userId} = auth();
    if(!userId) {
        return redirect("/");
    }

    const purchase = await db.purchase.findUnique({
        where: {
            //esto es para que un usuario solo pueda comprar un curso una vez
           courseId_userId: {
                courseId: course.id,
                userId
            }
        }
    });

    return (
        <div className="h-full border-r flex flex-col overflow-y-auto shadow-sm">
            <div className="p-8 flex-col border-b">
                <h1 className="font-semibold">{course.title}</h1>
                {purchase && (
                    <div className="mt-10">
                        <CourseProgress value={progressCount} variant="success" size="default" />
                    </div>
                )}
            </div>
            <div className="flex flex-col w-full">
                {course.chapters.map((chapter, index) => (
                    <CourseSidebarItem key={index} id={chapter.id} label={chapter.title} isCompleted={!!chapter.userProgress?.[0]?.isCompleted} courseId={course.id} isLocked={!chapter.isFree && !purchase} /> //[0] se pone 
                ))}
            </div>
        </div>
       
    );
}
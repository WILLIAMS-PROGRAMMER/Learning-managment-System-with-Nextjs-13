import { db } from "@/lib/db";
import { Category, Chapter, Course } from "@prisma/client";
import { getProgress } from "./get-progress";

type CourseWithProgressWithCategory = Course & {
    chapters: Chapter[];
    progress: number | null;
    category: Category;
};


type DashboardCourses = {
    completedCourses: CourseWithProgressWithCategory[];
    coursesInProgress: CourseWithProgressWithCategory[];
}

export const getDashboardCourses = async (userId: string): Promise<DashboardCourses> => {
    try {
        const purchaseCourses = db.purchase.findMany({
            where: {
                userId,
            },
            select: {
                course: {
                    include: {
                        category: true,
                        chapters: true,
                    },
                }
            },
        });

        const courses = (await purchaseCourses).map((purchase:any) => purchase.course) as CourseWithProgressWithCategory[];

        for (let course of courses) {
            const progress = await getProgress(userId, course.id);
            course["progress"] = progress;
        }

        const completedCourses = courses.filter((course) => course.progress === 100);
        const coursesInProgress = courses.filter((course) => course.progress !== 100);

        return {
            completedCourses,
            coursesInProgress,
        };
    
    } catch (error) {
        console.log("[getDashboardCourses] error", error);
        return {
            completedCourses: [],
            coursesInProgress: [],
        };
    }
}


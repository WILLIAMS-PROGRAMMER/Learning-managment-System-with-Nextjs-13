import { Category, Course } from "@prisma/client";
import { getProgress } from "./get-progress";
import { db } from "@/lib/db";




type CourseWithProgressWithCategory = Course & {
    category: Category | null;
    chapters: {id: string}[];
    progress: number | null;
};

type GetCourses = {
    userId: string;
    //title y category vienen de la url de la pagina de busqueda
    title?: string;
    categoryId?: string;
};

export const getCourses = async ({
    userId,
    title,
    categoryId
}: GetCourses): Promise<CourseWithProgressWithCategory[]> => {
    try {
        const courses = await db.course.findMany({
            where: {
                isPublished: true,
                title: {
                    contains: title,
                },
                categoryId
            },
            include: {
                category: true,
                chapters: {
                    where: {
                        isPublished: true
                    },
                    select: {
                        id:true
                    }
                },
                purchases: {
                    where: {
                        userId
                    }
                }
            },
            orderBy: {
                createdAt: "desc"
            }
        });

        const coursesWithProgress: CourseWithProgressWithCategory[] = await Promise.all(
            courses.map(async (course:any) => {
                if(course.purchases.length === 0) {
                    return {
                        ...course,
                        progress: null,
                    }
                }
                //this is the percentage of the progress of the course
                const progressPercentage = await getProgress(userId, course.id);
                return {
                    // esto retorna un objeto con todas las propiedades de course y ademas la propiedad progress en un solo objeto
                    ...course,
                    progress: progressPercentage
                };
            })
        
        )
        return coursesWithProgress;
    } catch (error) {
        console.log("[GET_COURSES]",error);
        return [];
    }
}


import { db } from "@/lib/db";
import { Course, Purchase } from "@prisma/client";

type PurchaseWithCourse = Purchase & {
    course: Course;
};

// esto retorna grouped = { "curso1": 100, "curso2": 200, "curso3": 300 }
const groupByCourse = (purchases: PurchaseWithCourse[]) => {
    const grouped: {[courseTitle: string]: number } = {};

    purchases.forEach((purchase) => {
        const courseTitle = purchase.course.title;
        if(!grouped[courseTitle]) {
            grouped[courseTitle] = 0;
        } 
        grouped[courseTitle] += purchase.course.price!;
        
    });
    return grouped;
};

export const getAnalytics = async (userId:string) => {
  try {
        const purchases =await db.purchase.findMany({
            where: {
                course: {
                    userId: userId
                }
            },
            include: {
                course: true
            }
        });

        const groupedEarnings = groupByCourse(purchases);
        const data = Object.entries(groupedEarnings).map(([courseTitle, total]) => ({
            name: courseTitle,
            total: total
        }));

        const totalRevenue = data.reduce((acc, current) => acc + current.total, 0);
        console.log(data, "totalRevenue");
        const totalSales = purchases.length;

        return {
            data,
            totalRevenue,
            totalSales
        }
  } catch (error) {
        console.log(error);
        return {
            data: [],
            totalRevenue: 0,
            totalSales: 0
        }
  }
}
import { Button } from "@/components/ui/button";
import Link from "next/link";

import {  columns } from "../courses/_components/columns"
import { DataTable } from "../courses/_components/data-table"
import { auth } from "@clerk/nextjs";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { PlusSquare } from "lucide-react";


const CoursesPage = async() => {

    const {userId} = auth();

    if (!userId) {
        return redirect("/");
    }

    const courses = await db.course.findMany({
        where: {
             userId
        },
        orderBy: {
            createdAt: "desc"
        }
    });


    return ( 
        <div className="p-6">
            <Link href="/teacher/create">
                <Button className="mb-4">
                    <PlusSquare className="mr-2 h-6 w-6" />
                    New Course
                </Button>
            </Link>
            <DataTable columns={columns} data={courses} />
        </div>
     );
}
 
export default CoursesPage;
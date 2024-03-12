import { Category, Course } from "@prisma/client";
import { CourseCard } from "./course-card";

type CourseWithProgressWithCategory = Course & {
    category: Category | null;
    chapters: {id:string}[];
    progress: number | null;
};

interface CourseListProps {
    items: CourseWithProgressWithCategory[];
}

export const CoursesList = ({items}:CourseListProps) => {
    return (
        <div>
            <div className="grid sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4">
                {items.map((item) => (
                    <div key={item.id}>
                        <CourseCard 
                            key={item.id}
                            id={item.id} 
                            title={item.title}
                            imageUrl={item.imageUrl!} //cuando un curso es publicado si o si tiene que tener una imagen
                            chaptersLenght={item.chapters.length} 
                            price={item.price!} //cuando un curso es publicado si o si tiene que tener un precio
                            progress={item.progress}
                            category={item.category?.name!} //cuando un curso es publicado si o si tiene que tener una categoria
                            //pero si no la categorria puede que no este por eso le ongo ?, aunqie no sea necesario,typescript no sabe todo esto por eso le pongo el ?
                        />
                    </div>
                ))}
            </div>
            {items.length === 0 && (
                <div className="text-center text-sm text-muted-foreground mt-10">
                    No course found... Try searching again
                </div>
            )}
        </div>
    )
}
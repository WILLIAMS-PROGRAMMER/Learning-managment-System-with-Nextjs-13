import Image from "next/image";
import Link from "next/link";
import { IconBadge } from "./icon-badge";
import { BookOpen } from "lucide-react";
import { formatPrice } from "@/lib/format";
import { CourseProgress } from "./CourseProgress";

interface CourseCardProps {
    id: string;
    title: string;
    imageUrl: string;
    chaptersLenght: number;
    price: number;
    progress: number | null;
    category: string;
}

export const CourseCard = ({ id,title,imageUrl,chaptersLenght,price,progress,category }: CourseCardProps) => {
   return (
         <Link href={`/courses/${id}`}>
            <div className="group hover:shadow-sm transition overflow-hidden border rounded-lg p-3 h-full mt-4 ">
                <div className="relative w-full aspect-video rounded-md overflow-hidden">
                    <Image
                        src={imageUrl}
                        alt={title}
                        layout="fill"
                        objectFit="cover"
                    />
                </div>
                <div className="flex flex-col pt-2">
                    <div className="text-lg md:text-base font-medium group-hover:text-sky-700 transition line-clamp-2">
                        {title}
                    </div>
                    <p className="text-xs text-muted-foreground">{category}</p>
                    <div className="my-3 flex items-center gap-x-2 text-sm md:text-xs">
                        <div className="flex items-center gap-x-1 text-slate-500">
                            <div className=" bg-yellow-200 rounded-full p-[3px]">
                                <IconBadge size="sm" icon={BookOpen} />
                            </div>
                            <span>{chaptersLenght}{chaptersLenght === 1 ? "Chapter" : "Chapters"}</span>   
                        </div>
                    </div>
                    {progress != null ? (
                        <CourseProgress value={progress} variant="success" size="default" />

                    ):(
                        <p className="text-md md:text-sm font-medium text-slate-700">
                            {formatPrice(price)} {price === 0 ? "Free" : "USD"}
                        </p>
                    )}
                </div>
            </div>
         </Link>
   )
            
}

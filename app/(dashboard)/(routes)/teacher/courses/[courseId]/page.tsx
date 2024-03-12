
import { IconBadge } from "@/components/icon-badge";
import {db} from "@/lib/db";
import { auth } from "@clerk/nextjs";
import { CircleDollarSign, File, LayoutDashboard, ListChecks } from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";
import { TitleForm } from "./_components/TitleForm";
import { DescriptionForm } from "./_components/DescriptionForm";
import { ImageForm } from "./_components/image-form";
import { CategoryForm } from "./_components/CategoryForm";
import Image from "next/image";
import { PriceForm } from "./_components/PriceForm";
import { AttachmentForm } from "./_components/attachmentForm";
import { ChaptersForm } from "./_components/ChaptersForm";
import Banner from "@/components/banner";
import Actions from "./_components/Actions";
const CourseIdPage = async ({params}: {params:{courseId:string}}) => {
    
    const {userId} = auth();

    if(!userId){
        return redirect("/");
    }

    const course = await db.course.findUnique({   
        where: {
            id: params.courseId
        },
        //include es para incluir relaciones en la consulta
        include: {
            attachments: {
                orderBy: {
                    createdAt: "desc" //desc es para ordenar de manera descendente
                }
            },
            chapters: {
                orderBy: {
                    position: "asc"
                }
            }
        }
    });

    if(!course || course.userId !== userId){
        return redirect("/");
    }

    //obtener las categorias de la base de datos
    const categories = await db.category.findMany({
        orderBy: {
            name: "asc"
        },
    });

    console.log(categories); //imprime las categorias en la consola ,no se imprime en la pagina web ya que esto es un server side rendering y no un client side rendering

    const requiredFields = [
        course.title,
        course.description,
        course.imageUrl,
        course.price,
        course.categoryId,
        course.attachments.length > 0,
        course.chapters.some((chapter) => chapter.isPublished), //some es para verificar si al menos un elemento cumple con la condicion de estar publicado
    ];

    const totalFields = requiredFields.length;
    const completedFields = requiredFields.filter(Boolean).length;
    const completionText = `(${completedFields}/${totalFields}) fields completed`;

    const isComplete = requiredFields.every(Boolean);

    return ( 
        <>
          {!course.isPublished && (
            <Banner label="This course is not published yet. It will not be visible to students until you publish it." variant="warning"/>
        )}
        <div className="p-6">
            <div className="flex items-center justify-between">
                <div className="flex flex-col gap-y-2">
                    <h1 className="text-2xl font-medium text-center -ml-2">Course setup</h1>
                    <span className="text-sm text-slate-700 bg-slate-100 py-2 -ml-2 text-center  rounded-3xl">{completionText}</span>
                    <Link className="text-blue-400 text-xs hover:underline hover:text-blue-700 mt-1" href="/">Read the docs &rarr;</Link>
                </div>

                
                <div className="block m-auto">
                    <div className=" p-4">
                        <Actions disabled={!isComplete} courseId={course.id} isPublished={course.isPublished}/>
                    </div>
                    <Image
                        src={course.imageUrl ? course.imageUrl : "https://static.vecteezy.com/system/resources/previews/004/141/669/non_2x/no-photo-or-blank-image-icon-loading-images-or-missing-image-mark-image-not-available-or-image-coming-soon-sign-simple-nature-silhouette-in-frame-isolated-illustration-vector.jpg"}
                        alt={course.title}
                        width={40000}
                        height={1000}
                        className="rounded-md h-[190px] w-[900px] border-2 border-blue-600 mx-3 hover:border-[6px] transition-all"
                    />
                </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-16">
                {/* LEFT SECTION */}
                <div>
                    <div className="flex items-center gap-x-2">
                        <div className="bg-sky-200 p-2 rounded-full">
                        <IconBadge icon={LayoutDashboard} variant="default" size="default" />
                        </div>
                        <div className="flex flex-col">
                            <h2 className="text-xl">Customize your course </h2>
                        </div>
                    </div>
                    <TitleForm initialData={course} courseId={course.id} />
                    <DescriptionForm initialData={course} courseId={course.id} />
                    <ImageForm initialData={course} courseId={course.id} />
                    <CategoryForm initialData={course} courseId={course.id} options={categories.map((category) => ({
                            label: category.name,
                            value: category.id   
                    }))} />
                    
                </div>
                
                {/* RIGHT SECTION */}
                <div className="space-y-6">
                   <div>
                        <div className="flex items-center gap-x-2">
                            <div className="bg-red-200 p-2 rounded-full">
                                <IconBadge icon={ListChecks} variant="default" size="default" />
                            </div>
                            <h2 className="text-xl">Course chapters</h2>
                        </div>
                        <div>
                            <ChaptersForm initialData={course} courseId={course.id} />
                        </div>
                       
                   </div>
                   <div>
                        <div className="flex items-center gap-x-2">
                            <div className="bg-green-200 p-2 rounded-full">
                                <IconBadge icon={CircleDollarSign} variant="default" size="default" />
                            </div>
                            <h2 className="text-xl">Sell your course</h2>
                        </div>
                        <PriceForm initialData={course} courseId={course.id} />
                   </div>

                   <div>
                        <div className="flex items-center gap-x-2">
                            <div className="bg-yellow-200 p-2 rounded-full">
                                <IconBadge icon={File} variant="default" size="default" />
                            </div>
                            <h2 className="text-xl">Resources && Attachments</h2>
                        </div>
                        <AttachmentForm initialData={course} courseId={course.id} />
                   </div>

                </div>
            </div>
        </div>
        </>
     );
}
 
export default CourseIdPage;
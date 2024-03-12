import Mux from "@mux/mux-node"; //muz-node es una libreria que nos permite trabajar con el api de mux para subir videos
import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";

const {Video} = new Mux(process.env.MUX_TOKEN_ID!, process.env.MUX_TOKEN_SECRET!);

export async function DELETE(
    req:Request,
    {params}: {params :{courseId:string, chapterId:string}}
) {
    try {
        const {userId} = auth();
        if(!userId){
            return new NextResponse("Unauthorized",{status:401})
        }
        const ownCourse = await db.course.findUnique({
            where: {
                id: params.courseId
            }
        });
        if(!ownCourse){
            return new NextResponse("Unauthorized",{status:401})
        }

        const chapter = await db.chapter.findUnique({
            where: {
                id: params.chapterId
            }
        });

        if(!chapter){
            return new NextResponse("Not found",{status:404})
        }

        if(chapter.videoUrl){
            const muxData = await db.muxData.findFirst({
                where: {
                    chapterId: params.chapterId
                }
            });

           

            if(muxData){
                const assetId = muxData?.assetId;
               
                try {
                    const assetDetails = await Video.Assets.get(assetId);
                    if(assetDetails){
                        await Video.Assets.del(
                            muxData.assetId
                        );
                    }
                } catch (error) {
                    console.log('error al obtener assetid');
                }

                await db.muxData.delete({
                    where: {
                        id: muxData.id
                    }
                });
            }
        }

        const deletedChapter = await db.chapter.delete({
            where: {
                id: params.chapterId
            }
        });

        const publishedChaptersInCourse = await db.chapter.findMany({
            where: {
                courseId: params.courseId,
                isPublished: true
            }
        });

        //si no hay capitulos publicados en el curso despues de eliminar ese chapter, entonces el curso no esta publicado
        if(!publishedChaptersInCourse.length){
            await db.course.update({
                where: {
                    id: params.courseId
                },
                // data es para actualizar los datos
                data: {
                    isPublished: false
                }
            });
        }

        return NextResponse.json(deletedChapter);


    } catch (error) {
        console.error("[COURSES_CHAPTER_ID_DELETE]", error);
        return new NextResponse("Internal server error",{status:500})
    }
}

 //PATCH se utiliza para actualizar parcialmente un recurso.
export async function PATCH(
    req:Request,
    {params}: {params :{courseId:string, chapterId:string}}
) {

    try {
        const {userId} = auth();
        if(!userId){
            return new NextResponse("Unauthorized",{status:401})
        }
       
        const {isPublished, ...values} = await req.json(); //isPublished lo quitamos de values para que no se actualice ya que hya un tema de seguridad
        //esto es para que el usuario solo pueda actualizar sus propios cursos
        console.log(values);
        const ownCourse = await db.course.findUnique({
            where: {
                id: params.courseId
            }
        });
        if(!ownCourse){
            return new NextResponse("Unauthorized",{status:401})
        }

        const chapter = await db.chapter.update({
            where: {
                id: params.chapterId
            },
            data: {...values}
            //tambien podria ser data: {title: values.title}
            //tambien podria ser data: { ...values }
        }); 

        if(values.videoUrl){
            const existingMuxData = await db.muxData.findFirst({
                where: {
                    chapterId: params.chapterId
                }
            });

            
            if(existingMuxData){
                const assetId = existingMuxData?.assetId;
                // await Video.Assets.del(
                //    existingMuxData.assetId
                // );
                // await db.muxData.delete({
                //     where: {
                //         id: existingMuxData.id
                //     }
                // });
                try {
                    const assetDetails = await Video.Assets.get(assetId);
                    if(assetDetails){
                        await Video.Assets.del(
                            existingMuxData.assetId
                        );
                    }
                } catch (error) {
                    console.log('error al obtener assetid');
                }
                
                // let a =1;
                // let b = 2;
                // if (a == 6) {
                //     await Video.Assets.del(
                //         existingMuxData.assetId
                //     );
                // }
                await db.muxData.delete({
                    where: {
                        id: existingMuxData.id
                    }
                });
               
            }

            const asset = await Video.Assets.create({
                input: values.videoUrl, // la url del video
                playback_policy: "public",
                test: false
            });
            
            await db.muxData.create({
                data: {
                    assetId: asset.id, //el id del video
                    playbackId: asset.playback_ids?.[0].id,
                    chapterId: params.chapterId
                }
            });
        }

        return NextResponse.json(chapter); //esto es para que devuelva el capitulo actualizado

    } catch (error) {
        console.error("[COURSES_CHAPTER_ID]", error);
        return new NextResponse("Internal server error",{status:500})
    }
}

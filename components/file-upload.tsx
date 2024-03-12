"use client"

import { UploadDropzone } from "@/lib/uploadthing"
import { ourFileRouter } from "@/app/api/uploadthing/core"
import toast from "react-hot-toast";

interface FileUploadProps {
    onChange: (url?: string) => void; //onChange es una funcion que recibe un parametro url de tipo string y no devuelve nada
    endpoint: keyof typeof ourFileRouter; // keyof es una palabra clave que se utiliza para obtener el tipo de todas las claves de un tipo de objeto
};

export const FileUpload = ({onChange, endpoint}: FileUploadProps) => {
    return (
        <UploadDropzone
            endpoint={endpoint}
            onClientUploadComplete={(res) => {
                onChange(res?.[0].url); //onChange recibe el parametro url que es igual a res en la posicion 0 , esto es para que se muestre la imagen que se subio
            }}
            onUploadError={(error:Error) => {
                toast.error("Upload failed, please try again.");
                
            }}
        />
    );
}
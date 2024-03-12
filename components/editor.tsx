"use client" //no es suficiente para desactivar el servidor, igual se renderiza en el servidor solo que tambien se renderiza en el cliente

import dynamic from 'next/dynamic' //next/dynamic es una libreria para importar componentes de forma dinamica
//useMemo es un gancho de React que memoriza el resultado de una función costosa para evitar recálculos innecesarios.
import { useMemo } from 'react'; 
import "react-quill/dist/quill.snow.css";

interface EditorProps {
    onChange: (value: string) => void;
    value: string;
}

export const Editor = ({onChange,value}:EditorProps) => {
    //useMemo es un gancho de React que memoriza el resultado de una función costosa para evitar recálculos innecesarios.
    const ReactQuill = useMemo(() => dynamic(() => import("react-quill"), { ssr: false }), []); //importa react-quill de forma dinamica para que no se renderice en el servidor
    return (
        <div className='bg-white'>
            <ReactQuill
                theme="snow"
                value={value}
                onChange={onChange}
            />
        </div>
    )
}
"use client"

import ReactConfettiExplosion from "react-confetti-explosion";


import {useConfettiStore} from "@/hooks/use-confetti-store";

export const ConfettiProvider = () => {
    const confetti = useConfettiStore();

    if(!confetti.isOpen) return null; //si no esta abierto no se muestra

    return (
        <ReactConfettiExplosion
        className="fixed top-0 left-1/2 transform -translate-x-1/2"
        particleSize={40}
            force={1}
            width={1800}
            duration={18000}
            onComplete={() => confetti.onClose()} 
            zIndex={1000}
            //onComplete es una funcion que se ejecuta cuando la animacion termina para cerrar el confetti
        />
    )
}
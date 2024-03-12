"use client"

import {Toaster} from "react-hot-toast";

export const ToasterProvider = () => {
    return (
        <Toaster
            position="top-right"
            reverseOrder={false}
            gutter={20} // gutter es el espacio entre los toast
            
            toastOptions={{
                duration: 2000,
                style: {
                    background: '#333',
                    color: '#fff',
                    border: '1px solid black',
                    padding: '6px',
                },
                success: {
                    style: {
                        background: '#4CAF50',
                    },
                    icon: '😁'
                },
                error: {
                    style: {
                        background: '#F44336',
                    },
                    icon: '🤕'
                },
                
            }}
        />
    )
}
"use client"

import { Category } from "@prisma/client"
import { IconType } from "react-icons"
import { FcEngineering, FcMusic } from "react-icons/fc"
import {CategoryItem} from "./category-item"
import { GiArtificialHive } from "react-icons/gi";

interface CategoriesProps {
    items: Category[] //Category is the type of the items ,[] se pone porque es un array

}

//Record es un tipo de typescript que crea un objeto con las keys que le pasemos y el tipo que le pasemos
//IconType es un tipo de react-icons ,se usa para que el iconMap tenga el tipo de IconType
const iconMap: Record<Category["name"], IconType> = {
    "Artificial Intelligence": GiArtificialHive,
    "Cybersecurity": FcMusic,
    "Data Science": FcMusic,
    "DevOps": FcMusic,
    "Game Development": FcMusic,
    "Machine Learning": FcMusic,
    "Mobile Development": FcMusic,
    "Other": FcMusic,
    "Quality Assurance": FcMusic,
    "Software Engineering": FcEngineering,
    "Web Development": FcMusic,
}

export const Categories = ({ items }:CategoriesProps) => {
    return (
        <div className="flex items-center gap-x-2 overflow-x-auto pb-2">
            {items.map((category) => (
                <CategoryItem key={category.id} label={category.name} icon={iconMap[category.name]} value={category.id} />
            ))}
        </div>
    )
}


//REACT ICONS:  https://react-icons.github.io/react-icons/search/#q=enginee
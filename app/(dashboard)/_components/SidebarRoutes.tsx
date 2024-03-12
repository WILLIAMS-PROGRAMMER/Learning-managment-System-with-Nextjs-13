"use client"; //sin esto no funciona

import { BarChart, Compass, Gamepad, Layout, List, MailCheck } from "lucide-react"
import SidebarItem from "./SidebarItem";
import { usePathname } from "next/navigation";

const guestRoutes = [
    {
        icon: Layout,
        label: "Dashboard",
        href: "/",
    },
    {
        icon: Compass,
        label: "Browse",
        href: "/search",
    }, 
    {
        icon: Gamepad,
        label: <p className="text-sm">Free Games <span className="font-medium text-[9px] bg-green-600 rounded-full text-white p-[6px] ml-1">New Feature</span></p>,
        href: "/games",
    },
    {
        icon: MailCheck,
        label: <p className="text-sm">Any issue?</p>,
        href: "/email",
    }

]

const teacherRoutes = [
    {
        icon: List,
        label: "Courses",
        href: "/teacher/courses",
    },
    {
        icon: BarChart,
        label: "Analytics",
        href: "/teacher/analytics",
    },  
]

export default function SidebarRoutes() {

    const pathname = usePathname();

    const isTeacherPage = pathname?.startsWith("/teacher");
    const routes = isTeacherPage ? teacherRoutes : guestRoutes;

  return (
    <div className='flex flex-col w-full'>
        {routes.map((route,index) => (
            <SidebarItem
                key={index}
                icon={route.icon}
                label={route.label}
                href={route.href}
            />
        ))}
    </div>
  )
}

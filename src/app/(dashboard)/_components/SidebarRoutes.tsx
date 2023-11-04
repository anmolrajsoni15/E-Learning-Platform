'use client'

import React from 'react'
import {Layout, Compass, List, BarChart2} from 'lucide-react'
import SidebarItem from './SidebarItem'
import { usePathname } from 'next/navigation'

const guestRoutes = [
    {
        icon: Layout,
        label: "Dashboard",
        href: "/"
    },
    {
        icon: Compass,
        label: "Browse",
        href: "/search"
    }
]

const teacherRoutes = [
    {
        icon: List,
        label: "Courses",
        href: "/teacher/courses"
    },
    {
        icon: BarChart2,
        label: "Analytics",
        href: "/teacher/analytics"
    }
]

const SidebarRoutes = () => {
    const pathname = usePathname();

    const isTeacherPage = pathname?.includes("/teacher");
    const routes = isTeacherPage ? teacherRoutes : guestRoutes;
  return (
    <div className='flex flex-col w-full'>
        {
            routes.map((route, index) => (
                <SidebarItem
                    key={index}
                    icon={route.icon}
                    label={route.label}
                    href={route.href}
                />
            ))
        }
    </div>
  )
}

export default SidebarRoutes
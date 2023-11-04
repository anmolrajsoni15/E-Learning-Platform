'use client'

import { cn } from '@/lib/utils'
import { usePathname, useRouter } from 'next/navigation'
import React from 'react'

interface Props{
    icon: any,
    label: string,
    href: string
}

const SidebarItem:React.FC<Props> = ({
    icon: Icon,
    label,
    href
}) => {

    const pathName = usePathname();
    const router = useRouter();

        const isActive = (pathName === "/" && href === "/") || (pathName === href) || (pathName?.startsWith(`${href}/`));

        const onClick = () => {
            router.push(href);
        }

      return (
        <button
            onClick={onClick}
            type='button'
            className={cn(
                "flex items-center gap-x-2 text-slate-500 text-sm font-[500] pl-6 transition-all hover:text-slate-600 hover:bg-slate-300/20",
                isActive && "bg-sky-200/20 text-sky-600 hover:bg-sky-200/20 hover:text-sky-600"
            )} 
            title={label}
        >
            <div className="flex items-center gap-x-2 py-4">
                <Icon
                  size={22}
                  className={cn(
                    "transition-all text-slate-500",
                    isActive && "text-sky-600"
                  )}
                />
                <span>{label}</span>
            </div>
            <div className={
                cn(
                    "ml-auto opacity-0 border-2 border-sky-600 h-full transition-all",
                    isActive && "opacity-100"
                )
            }></div>
        </button>
      )
}

export default SidebarItem
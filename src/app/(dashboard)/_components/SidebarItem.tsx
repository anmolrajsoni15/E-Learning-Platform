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
                "flex items-center gap-x-2 text-slate-[#F2F4F7] text-sm font-[500] pl-6 transition-all hover:text-white hover:bg-[#344054]",
                isActive && "bg-[#344054] text-white hover:bg-[#344054] hover:text-white"
            )} 
            title={label}
        >
            <div className="flex items-center gap-x-2 py-4">
                <Icon
                  size={22}
                  className={cn(
                    "transition-all text-[#D0D5DD]",
                    isActive && "text-white"
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
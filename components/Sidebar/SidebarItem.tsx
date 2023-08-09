'use client'

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { sidebarRoute } from './utils/constant';


export default function SidebarItem() {
    const pathname = usePathname();

    return (
        <ul className="flex flex-col gap-2">
            {sidebarRoute.map(item => (
                <li>
                    <Link
                        href={item.route}
                        className="group"
                    >
                        <div className={`flex justify-start items-center transition duration-150 group-hover:bg-indigo-500 p-3 rounded ${pathname === item.route ? 'bg-indigo-500' : 'bg-white'}`}>
                            <div className={`group-hover:text-white mr-3 ${pathname === item.route ? 'text-white' : 'text-indigo-700'}`}>
                                {item.icon}
                            </div>
                            <p className={`group-hover:text-white text-sm ${pathname === item.route ? 'text-white' : 'text-indigo-700'}`}>
                                {item.title}
                            </p>
                        </div>
                    </Link>
                </li>
            ))}
        </ul>
    )
}

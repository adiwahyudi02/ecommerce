'use client'

import { Card } from 'antd';
import SidebarItem from './SidebarItem';

export default function SidebarDesktop() {
    return (
        // <div className="w-[300px] h-full bg-white rounded-xl p-5 shadow-md">
        <Card className="w-[300px] h-full bg-white rounded-xl p-5">
            <h1 className="text-lg font-bold mt-10 text-indigo-800 ml-2">
                Ecommerce.
            </h1>

            <div className="mt-20">
                <SidebarItem />
            </div>
        </Card>
        // </div>
    );
}

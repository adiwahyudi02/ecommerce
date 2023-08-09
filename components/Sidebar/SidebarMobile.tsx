'use client'

import { RiMenuUnfoldLine } from 'react-icons/ri';
import { IoMdClose } from 'react-icons/io';
import { useState } from 'react';
import SidebarItem from './SidebarItem';
import { AnimatePresence, motion } from 'framer-motion';

export default function SidebarMobile() {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div>
            <div className="flex gap-4 items-center mb-16">
                <div
                    className="bg-white shadow-md rounded w-11 h-11 flex justify-center items-center cursor-pointer z-10"
                    onClick={() => setIsOpen(true)}
                >
                    <RiMenuUnfoldLine className="text-indigo-800 text-2xl" />
                </div>
                <h1 className="w-full absolute left-0 text-center text-lg font-bold text-indigo-800">
                    Ecommerce.
                </h1>
            </div>
            <AnimatePresence>
                {isOpen && (
                    <>
                        <motion.div
                            initial={{ width: 0 }}
                            animate={{
                                width: 300
                            }}
                            exit={{
                                width: 0,
                            }}
                            className="h-full bg-white fixed left-0 top-0 z-20 overflow-hidden"
                        >
                            <div className="flex justify-between items-center mx-5 my-10">
                                <h1 className="text-lg font-bold text-indigo-800 ml-2">
                                    Ecommerce.
                                </h1>
                                <div
                                    className="cursor-pointer"
                                    onClick={() => setIsOpen(false)}
                                >
                                    <IoMdClose className="text-indigo-800 text-3xl" />
                                </div>
                            </div>
                            <div className="m-5 mt-20">
                                <SidebarItem />
                            </div>
                        </motion.div>

                        {/* backdrop */}
                        <div
                            className="bg-black opacity-30 w-full h-full fixed left-0 top-0 z-10"
                            onClick={() => setIsOpen(false)}
                        />
                    </>
                )}
            </AnimatePresence>
        </div>
    );
}

import { X } from 'lucide-react';
import React from 'react';

export const Modal = ({ children, modalTitle, showHeading = true, open, onClose }) => {
    return (
        <div className={`flex absolute p-0 inset-0 z-50 ease-in-out duration-500 justify-center items-center overflow-hidden md:px-0 px-5 ${open ? 'opacity-100 visible backdrop-blur-sm' : 'opacity-0 invisible'}`}>
            <div className="z-[51] md:h-auto mx-auto md:w-auto overflow-auto rounded-md bg-white w-full" style={{ maxHeight: '95vh' }}>
                <div className="relative rounded-lg shadow">
                    <div className="flex flex-col min-w-[620px] text-neutral-700 md:w-[800px] w-auto m-0">
                        <div className={`flex justify-between items-center border-b top-0 ${showHeading ? 'block' : 'hidden'}`}>
                            <div className="flex items-center p-4 justify-between w-full">
                                <h1 className="md:text-2xl text-xl font-medium">{modalTitle}</h1>
                                <button onClick={onClose} className="md:text-2xl text-xl hover:text-red-500">
                                    <X />
                                </button>
                            </div>
                        </div>
                        {children}
                    </div>
                </div>
            </div>
            <div className="w-full fixed h-screen backdrop-blur-sm bg-black bg-opacity-40" onClick={() => { onClose() }}></div>
        </div>
    );
};
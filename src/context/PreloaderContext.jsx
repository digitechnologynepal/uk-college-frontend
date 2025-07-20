import React, { createContext, useState } from 'react';
import PacmanLoader from 'react-spinners/PacmanLoader';

export const PreloaderContext = createContext()

const PreloaderContextProvider = ({ children }) => {
    const [preLoading, setPreLoading] = useState(false)

    return (
        <PreloaderContext.Provider value={{ preLoading, setPreLoading }}>
            {children}
            {preLoading && (
                <>
                    <div className="flex fixed p-0 inset-0 z-[2147483647] justify-center items-center opacity-100 visible backdrop-blur-sm md:px-0">
                        <PacmanLoader size={40} color={'#1283b2'} />
                    </div>
                </>
            )}
        </PreloaderContext.Provider>
    )
}

export default PreloaderContextProvider

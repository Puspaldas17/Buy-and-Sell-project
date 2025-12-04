'use client'
import { SessionProvider } from "next-auth/react";
import React from 'react';
import { RecoilRoot } from "recoil";
import { EdgeStoreProvider } from "../lib/edgestore";

type Children = {
    children : React.ReactNode
}
export default function Providers({children} : Children){
    return(
        <RecoilRoot>
            <SessionProvider>
                <EdgeStoreProvider>{children}</EdgeStoreProvider>
                
            </SessionProvider>
        </RecoilRoot>
    )
}


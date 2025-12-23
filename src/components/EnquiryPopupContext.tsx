"use client";

import React, { createContext, useContext, useState, useCallback, ReactNode } from "react";

interface EnquiryPopupContextType {
    openEnquiryPopup: () => void;
    closeEnquiryPopup: () => void;
    isOpen: boolean;
}

const EnquiryPopupContext = createContext<EnquiryPopupContextType | undefined>(undefined);

export function useEnquiryPopup() {
    const context = useContext(EnquiryPopupContext);
    if (!context) {
        throw new Error("useEnquiryPopup must be used within EnquiryPopupProvider");
    }
    return context;
}

export function EnquiryPopupProvider({ children }: { children: ReactNode }) {
    const [isOpen, setIsOpen] = useState(false);

    const openEnquiryPopup = useCallback(() => setIsOpen(true), []);
    const closeEnquiryPopup = useCallback(() => setIsOpen(false), []);

    return (
        <EnquiryPopupContext.Provider value={{ openEnquiryPopup, closeEnquiryPopup, isOpen }}>
            {children}
        </EnquiryPopupContext.Provider>
    );
}

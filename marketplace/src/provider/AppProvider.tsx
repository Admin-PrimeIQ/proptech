"use client";

import { AppContextType } from "@/types/custom-interface";
import React, { createContext, useState } from "react";

export const AppContext = createContext<AppContextType | undefined>(undefined);
const AppProvider = ({ children }: { children: React.ReactNode }) => {

  const [openOffcanvas, setOpenOffcanvas] = useState<boolean>(false);
  const [isOpen, setIsOpen] = useState(false);
  const [isEnter, setIsEnter] = useState<boolean>(false);

  // Toggle Functions
  const toggleOffcanvas = () => setOpenOffcanvas(!openOffcanvas);
  const toggleOpen = () => setIsOpen((prev) => !prev);

  // handle mouse enter
  const handleMouseEnter = () => {
    setIsEnter(true);
  };
  // handle leave
  const handleMouseLeave = () => {
    setIsEnter(false);
  };

  const contextValue: AppContextType = {
    openOffcanvas,
    setOpenOffcanvas,
    toggleOffcanvas,
    toggleOpen,
    isOpen,
    isEnter,
    handleMouseEnter,
    handleMouseLeave,
  };

  return (
    <AppContext.Provider value={contextValue}>{children}</AppContext.Provider>
  );
};

export default AppProvider;

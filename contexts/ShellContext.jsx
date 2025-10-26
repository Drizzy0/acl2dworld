"use client";
import { createContext, useContext } from "react";

export const ShellContext = createContext({
  hideShell: false,
  setHideShell: () => {},
});

export const useShell = () => useContext(ShellContext);
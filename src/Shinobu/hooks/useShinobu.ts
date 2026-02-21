import { useContext } from "react";
import { ShinobuContext } from "../contexts/ShinobuContext";

export const useShinobu = () => {
  const ctx = useContext(ShinobuContext);
  if (!ctx) {
    throw new Error(
      "useShinobu must be used inside ShinobuProvider"
    );
  }
  return ctx;
};
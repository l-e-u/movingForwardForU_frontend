import { ArchivesContext } from "../context/ArchivesContext";
import { useContext } from "react";

export const useArchivesContext = () => {
   const context = useContext(ArchivesContext);

   if (!context) {
      throw Error("useArchivesContext must be used inside ArchivesContextProvider");
   };

   return context;
};
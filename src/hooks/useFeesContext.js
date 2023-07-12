import { FeesContext } from "../context/FeesContext";
import { useContext } from "react";

export const useFeesContext = () => {
   const context = useContext(FeesContext);

   if (!context) {
      throw Error('useFeesContext must be used inside FeesContextProvider');
   };

   return context;
};
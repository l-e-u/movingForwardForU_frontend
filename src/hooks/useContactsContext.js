import { ContactsContext } from "../context/ContactsContext";
import { useContext } from "react";

export const useContactsContext = () => {
   const context = useContext(ContactsContext);

   if (!context) {
      throw Error('useContactsContext must be used inside ContactsContextProvider');
   };

   return context;
};
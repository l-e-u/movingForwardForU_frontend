import { createContext, useReducer } from "react";

export const ContactsContext = createContext();

export const contactsReducer = (state, action) => {
   switch (action.type) {
      case 'SET_CONTACTS':
         return { contacts: action.payload };

      case 'CREATE_CONTACT':
         return { contacts: [action.payload, ...state.contacts] };

      case 'DELETE_CONTACT':
         return { contacts: state.contacts.filter((c) => c._id !== action.payload._id) };

      case 'UPDATE_CONTACT':
         return { contacts: state.contacts.map((c) => c._id === action.payload._id ? action.payload : c) };

      default:
         return state;
   };
};

// Every component wrapped by provider will have access to the context
export const ContactsContextProvider = ({ children }) => {
   const [state, dispatch] = useReducer(
      contactsReducer,
      { contacts: [] }
   );

   return (
      <ContactsContext.Provider value={{ ...state, dispatch }}>
         {children}
      </ContactsContext.Provider>
   )
};
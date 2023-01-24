import { StatusesContext } from "../context/StatusesContext.js";
import { useContext } from "react";

export const useStatusesContext = () => {
    const context = useContext(StatusesContext);

    if (!context) {
        throw Error('useStatusesContext must be used inside StatusesContextProvider')
    };

    return context;
};
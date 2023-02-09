import { MyJobsContext } from "../context/MyJobsContext.js";
import { useContext } from "react";

export const useMyJobsContext = () => {
    const context = useContext(MyJobsContext);

    if (!context) {
        throw Error("useMyJobsContext must be used inside MyJobsContextProvider");
    };

    return context;
};
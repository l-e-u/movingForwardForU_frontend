import { JobsContext } from "../context/JobsContext.js";
import { useContext } from "react";

export const useJobsContext = () => {
    const context = useContext(JobsContext);

    if (!context) {
        throw Error("useJobsContext must be used inside JobsContextProvider");
    };

    return context;
};
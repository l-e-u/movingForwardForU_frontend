import { StopsContext } from "../context/StopsContext"
import { useContext } from "react";

export const useStopsContext = () => {
    const context = useContext(StopsContext);

    if (!context) {
        throw Error('useStopsContext must be used inside StopsContextProvider');
    };

    return context;
};
import { VehiclesContext } from "../context/VehiclesContext"
import { useContext } from "react";

export const useVehiclesContext = () => {
    const context = useContext(VehiclesContext);

    if (!context) {
        throw Error('useVehiclesContext must be used inside VehiclesContextProvider');
    };

    return context;
};
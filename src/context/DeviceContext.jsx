import { createContext, useReducer, useContext } from "react";
import { initialDeviceState } from "./initialDeviceState";
import { deviceReducer } from "./deviceReducer";
const DeviceContext = createContext();

export const DeviceProvider = ({ children }) => {
  const [state, dispatch] = useReducer(deviceReducer, initialDeviceState);

  return (
    <DeviceContext.Provider value={{ state, dispatch }}>
      {children}
    </DeviceContext.Provider>
  );
};

export const useDevice = () => useContext(DeviceContext);

import PropTypes from "prop-types";
import React, { createContext, useState } from "react";

interface TNSToastMessage {
  title: string;
  message: string;
}

export const initialTnsError: TNSToastMessage = { title: "", message: "" };
export const initialTnsSuccess: TNSToastMessage = { title: "", message: "" };

interface DefaultValue {
  name: string;
  setName: (name: string) => void;
  tnsError: TNSToastMessage;
  setTnsError: (error: TNSToastMessage) => void;
  tnsSuccess: TNSToastMessage;
  setTnsSuccess: (info: TNSToastMessage) => void;
}
const defaultValue: DefaultValue = {
  name: "",
  setName: undefined,
  tnsError: initialTnsError,
  setTnsError: undefined,
  tnsSuccess: initialTnsSuccess,
  setTnsSuccess: undefined,
};

export const TNSContext = createContext(defaultValue);

const TNSContextProvider = ({ children }) => {
  // The entered name
  const [name, setName] = useState("");
  // Error/success after mint, etc...
  const [tnsError, setTnsError] = useState(initialTnsError);
  const [tnsSuccess, setTnsSuccess] = useState(initialTnsSuccess);

  return (
    <TNSContext.Provider
      value={{
        name,
        setName,
        tnsError,
        setTnsError,
        tnsSuccess,
        setTnsSuccess,
      }}
    >
      {children}
    </TNSContext.Provider>
  );
};

TNSContextProvider.propTypes = {
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node,
  ]),
};

export default TNSContextProvider;

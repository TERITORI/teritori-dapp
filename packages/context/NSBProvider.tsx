import PropTypes from "prop-types";
import React, { createContext, useState } from "react";

interface NSBError {
  title: string;
  message: string;
}
export const initialNsbError: NSBError = { title: "", message: "" };

interface DefaultValue {
  name: string;
  setName: (name: string) => void;
  signedUserIsOwner: boolean;
  setSignedUserIsOwner: (isOwner: boolean) => void;
  nsbError: NSBError;
  setNsbError: (error: NSBError) => void;
}
const defaultValue: DefaultValue = {
  name: "",
  setName: undefined,
  signedUserIsOwner: false,
  setSignedUserIsOwner: undefined,
  nsbError: initialNsbError,
  setNsbError: undefined,
};

export const NSBContext = createContext(defaultValue);

const NSBContextProvider = ({ children }) => {
  // The entered name
  const [name, setName] = useState("");
  //TODO:
  const [signedUserIsOwner, setSignedUserIsOwner] = useState(false);
  // Error after mint, etc...
  const [nsbError, setNsbError] = useState(initialNsbError);

  return (
    <NSBContext.Provider
      value={{
        name,
        setName,
        signedUserIsOwner,
        setSignedUserIsOwner,
        nsbError,
        setNsbError,
      }}
    >
      {children}
    </NSBContext.Provider>
  );
};

NSBContextProvider.propTypes = {
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node,
  ]),
};

export default NSBContextProvider;

import React, {
  createContext,
  useContext,
  useState,
  useMemo,
  ReactNode,
} from "react";

export interface LoggedInContextState {
  isLoggedIn: boolean;
  setIsLoggedIn: (isLoggedIn: boolean) => void;
}

const defaultState: LoggedInContextState = {
  isLoggedIn: false,
  setIsLoggedIn: () => {},
};

const LoggedInContext = createContext<LoggedInContextState>(defaultState);

interface LoggedInProviderProps {
  children: ReactNode;
  defaultSession?: boolean;
}

export const LoggedInProvider: React.FC<LoggedInProviderProps> = ({
  children,
  defaultSession,
}) => {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(
    defaultSession || false
  );

  const contextValue = useMemo(
    () => ({
      isLoggedIn,
      setIsLoggedIn,
    }),
    [isLoggedIn]
  );

  return (
    <LoggedInContext.Provider value={contextValue}>
      {children}
    </LoggedInContext.Provider>
  );
};

export const useLoggedIn = () => useContext(LoggedInContext);

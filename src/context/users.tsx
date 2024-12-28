import React, {
  createContext,
  useContext,
  useState,
  useMemo,
  ReactNode,
} from "react";

export interface User {
  userName: string;
  profilePicture: string;
  userCustomId: string;
  profileName: string;
  globalRanking: number;
  balance: Number;
  Auth: string;
  level: number;
  premiumUser: boolean;
}

export interface UserContextState {
  users: User[];
  setUsers: (users: User[]) => void;
}

const defaultState: UserContextState = {
  users: [],
  setUsers: () => {},
};

const defaultUser = {
  userName: "",
  profilePicture: "",
  userCustomId: "",
  profileName: "",
  globalRanking: 0,
  balance: 0,
  Auth: "",
  level: 0,
  premiumUser: false,
};

// Creating the context
const UsersContext = createContext<UserContextState>(defaultState);

interface LeadsProviderProps {
  children: ReactNode;
}

// Context provider component
export const UsersProvider: React.FC<LeadsProviderProps> = ({ children }) => {
  const [users, setUsers] = useState<User[]>([defaultUser]);

  const contextValue = useMemo(
    () => ({
      users,
      setUsers
    }),
    [users]
  );

  return (
    <UsersContext.Provider value={contextValue}>
      {children}
    </UsersContext.Provider>
  );
};

// Custom hook to use the users context
export const useUsers = () => useContext(UsersContext);

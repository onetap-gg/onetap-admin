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
  suspended: boolean;
  deleted: boolean;
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
  suspended: false,
  deleted: false,
};

const UsersContext = createContext<UserContextState>(defaultState);

interface UsersProviderProps {
  children: ReactNode;
}

export const UsersProvider: React.FC<UsersProviderProps> = ({ children }) => {
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

export const useUsers = () => useContext(UsersContext);

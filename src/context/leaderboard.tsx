import React, {
  createContext,
  useContext,
  useState,
  useMemo,
  ReactNode,
} from "react";

export type LeaderBoardData = {
  id: any;
  User: {
    userName: any;
  }[];
  gameBalance: any;
  gameLevel: any;
  Game: {
    gameName: any;
  }[];
};

export interface LeaderboardContextState {
  leaderboard: LeaderBoardData[];
  setLeaderboard: (leaderboard: LeaderBoardData[]) => void;
}

const defaultState: LeaderboardContextState = {
  leaderboard: [],
  setLeaderboard: () => {},
};

const defaultLeaderboard = {
  id: 0,
  User: [
    {
      userName: "",
    },
  ],
  gameBalance: 0,
  gameLevel: 0,
  Game: [
    {
      gameName: "",
    },
  ],
};

const LeaderboardContext = createContext<LeaderboardContextState>(defaultState);

interface LeaderboardProviderProps {
  children: ReactNode;
}

export const LeaderboardProvider: React.FC<LeaderboardProviderProps> = ({
  children,
}) => {
  const [leaderboard, setLeaderboard] = useState<LeaderBoardData[]>([
    defaultLeaderboard,
  ]);

  const contextValue = useMemo(
    () => ({
      leaderboard,
      setLeaderboard,
    }),
    [leaderboard]
  );

  return (
    <LeaderboardContext.Provider value={contextValue}>
      {children}
    </LeaderboardContext.Provider>
  );
};

export const useLeaderboard = () => useContext(LeaderboardContext);

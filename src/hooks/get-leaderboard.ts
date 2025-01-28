import axios from "axios";

export const getLeaderboard = () => {
  const leaderboard = axios.get(`/api/getAllLeaderboard`).then((response) => {
    console.log("leaderboard", response);
    return response.data;
  });

  return leaderboard;
  // return allUsers1;
};

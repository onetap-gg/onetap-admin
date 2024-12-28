import axios from "axios";

export const getLeaderboard = () => {
  const leaderboard = axios
    .get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/leaderboard/all-data`)
    .then((response) => {
      console.log("users", response);
      return response.data;
    });

  return leaderboard;
  // return allUsers1;
};

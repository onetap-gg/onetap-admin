import axios from "axios";

export const getChallenges = () => {
  const challenges = axios
    .get(`/api/challenges/getAllChallenges`)
    .then((response) => {
      console.log("challenges", response);
      return response.data;
    });

  return challenges;
};

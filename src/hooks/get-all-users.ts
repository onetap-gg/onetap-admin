import axios from "axios";

export const getAllUsers = () => {
  const allUsers = axios.get(`/api/getAllUsers`).then((response) => {
    console.log("users", response);
    return response.data;
  });

  return allUsers;
};

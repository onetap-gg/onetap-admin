import axios from "axios";

export const getAllUsers = () => {
  // const allUsers = axios
  //   .post(`/api/getAllUsers`, { page: page })
  //   .then((response) => {
  //     console.log("users", response);
  //     return response.data;
  //   });

  const allUsers = axios
    .get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/user/all/basic-info`)
    .then((response) => {
      console.log("users", response);
      return response.data;
    });

  return allUsers
  // return allUsers1;
};
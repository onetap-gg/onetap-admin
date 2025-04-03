import axios from "axios";

export const getAllSubscriptions = () => {
  const subscriptions = axios
    .get(`/api/subscriptions/getAllSubscriptions`)
    .then((response) => {
      console.log("subscriptions", response);
      return response.data;
    });

  return subscriptions;
};

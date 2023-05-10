import moment from "moment";

export const sendMessageData = (username, text) => {
  return {
    username,
    text,
    time: moment().format("h:mm a"),
  };
};

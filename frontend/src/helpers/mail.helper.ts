import { message } from "antd";
import Axios from "./axios";

const API = import.meta.env.REACT_APP_MAIL_API;

interface EmailData {
  sender?: string;
  recepients: string[];
  subject: string;
  template: string;
  text: string;
  name?: string;
  email?: string;
  password?: string;
  hr?: string;
  closure: string;
}

export const sendMailHelper = async (emailData: EmailData) => {
  try {
    const res = await Axios.post(API, emailData);
    return res.data;
  } catch (error) {
    message.error("Failed to send mail");
  }
};

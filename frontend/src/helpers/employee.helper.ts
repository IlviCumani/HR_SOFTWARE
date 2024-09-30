import { message } from "antd";
import Axios from "./axios";

const API = import.meta.env.REACT_APP_EMPLOYEE_SEARCH_API;
const FETCH_EMPLOYEE_API = import.meta.env.REACT_APP_EMPLOYEE_API;

export const useEmployeeAPI = () => {
  const fetchEmployee = async (name: string, surname: string) => {
    try {
      const response = await Axios.get(API, {
        params: { name, surname },
      });
      return response.data;
    } catch (err) {
      const error =
        err instanceof Error ? err.message : "Unknown error occurred";
      message.error(error || "Failed to fetch employees");
      return [];
    }
  };

  const fetchEmployeeByID = async (id: string) => {
    try {
      const response = await Axios.get(`${FETCH_EMPLOYEE_API}/${id}`);
      return response.data;
    } catch (err) {
      const error =
        err instanceof Error ? err.message : "Unknown error occurred";
      message.error(error || "Failed to fetch employee by ID");
      return null;
    }
  };

  return { fetchEmployee, fetchEmployeeByID };
};

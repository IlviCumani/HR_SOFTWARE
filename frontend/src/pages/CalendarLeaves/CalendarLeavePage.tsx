import Scheduler from "./components/Scheduler";
import { useState, useEffect } from "react";
import { OnLeaveData } from "./types/DataTypes";
import useHttp from "../../hooks/useHttp";
import { getFromLocalStorage } from "../../utils/utils";

const API = import.meta.env.REACT_APP_DAYOFF_API;

const CalendarLeavePage: React.FC = () => {
  const [dataSource, setDataSource] = useState<OnLeaveData[]>([]);
  const [, , fetchData] = useHttp();

  useEffect(() => {
    const user = getFromLocalStorage();
    const employeeId = user?._id;
    fetchData(
      {
        endpoint: `${API}/accepted/${employeeId}`,
      },
      (data) => {
        setDataSource(data);
      }
    );
  }, []);

  console.log(dataSource);

  return (
    <section className="scheduler-container">
      <Scheduler dataSource={dataSource}  />
    </section>
  );
};

export default CalendarLeavePage;

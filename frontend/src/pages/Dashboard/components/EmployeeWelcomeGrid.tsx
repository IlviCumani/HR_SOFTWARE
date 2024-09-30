// import { Card, Col, Flex, Row } from "antd";
// import Title from "antd/es/typography/Title";
// import "../styles/EmployeeWelcomeGrid.css";
// import { EmployeeDataType } from "../../Employment/types/Employee";
// import { useEffect, useState } from "react";
// import useHttp from "../../../hooks/useHttp";
// import Loader from "../../../components/Shared/Loader";
// import Promotions from "../../../assets/promotions.png";
// import CalendarGrid from "./CalendarGrid";
// import TaskGrid from "./TaskGrid";
// import EmployeeLineGraph from "./EmployeeLineGraph";
// import { useTranslation } from "react-i18next";
// import JokeCard from "./JokeCard";
// import { Doughnut } from "react-chartjs-2";
// import { PromoteType } from "../../Promotion/types/PromoteType";
// import QouteCard from "./QouteCard";

// interface Item {
//   title: string;
//   content?: any;
//   color: string;
//   status: string;
// }

// interface Data {
//   paragraph: string;
//   days?: any;
// }

// const EmployeeWelcomeGrid: React.FC = () => {
//   const options = {};
//   const [isLoading, error, sendRequest] = useHttp();
//   const { t } = useTranslation();
//   const [tableData, setTableData] = useState<EmployeeDataType>();
//   const EmployeData = JSON.parse(
//     localStorage.getItem("userData") || "{}"
//   ).employID;

//   const initialItem: Item[] = [
//     {
//       title: t("projectManager"),
//       content: tableData?.teamLeader || undefined,
//       color: "#474CCC",
//       status: "pr",
//     },
//     {
//       title: t("holidayEntitlement"),
//       content: tableData?.teamLeader || undefined,
//       color: "#CA054D",
//       status: "holiday",
//     },
//     {
//       title: t("currentSalary"),
//       content: tableData?.salary || undefined,
//       color: "#136F63",
//       status: "pr",
//     },
//   ];

//   const holidayData: Data[] = [
//     {
//       paragraph: "Total",
//       days: "",
//     },
//     {
//       paragraph: "Taken",
//       days: "",
//     },
//     {
//       paragraph: "Remaining",
//       days: "",
//     },
//   ];

//   useEffect(() => {
//     sendRequest(
//       {
//         endpoint: `employees/${EmployeData}`,
//       },
//       (data: EmployeeDataType) => {
//         setTableData(data);
//       }
//     );
//   }, []);

//   if (isLoading) {
//     return <Loader />;
//   }

//   if (error) {
//     return <div>Something went wrong!!</div>;
//   }

//   const data = {
//     labels: ["Off", "On"],
//     datasets: [
//       {
//         label: "Days",
//         data: [10, 15],
//         backgroundColor: ["#FFBC42", "#73D2DE"],
//       },
//     ],
//   };

//   return (
//     <>
//       <Flex className="flex-main" justify="center" gap={10}>
//         <div>
//           <Flex justify="space-between">
//             {initialItem.map((item, index) => {
//               return (
//                 <Col key={index} className="employee-card">
//                   <Card
//                     className="card-employee"
//                     style={{ backgroundColor: item.color }}
//                   >
//                     <h2 className="card-title">{item.title}</h2>
//                     {item.status === "holiday" ? (
//                       <Flex className="holiday-card">
//                         {holidayData.map((data, index) => {
//                           return (
//                             <div key={index}>
//                               <p style={{ color: "white" }}>{data.paragraph}</p>
//                               <br />
//                               <p style={{ color: "white" }}>{data.days}</p>
//                             </div>
//                           );
//                         })}
//                       </Flex>
//                     ) : (
//                       <h1
//                         style={{
//                           color: "white",
//                         }}
//                         className="card-text"
//                       >
//                         {item.content}
//                       </h1>
//                     )}
//                   </Card>
//                 </Col>
//               );
//             })}
//           </Flex>
//           <Row style={{ gap: "20px", marginBottom: "20px" }}>
//             <Col>
//               <Card
//                 className="pie-chart"
//                 style={{
//                   height: "100%",
//                   boxShadow: "3.9px 7.8px 7.8px hsla(0, 0%, 69%, 0.407)",
//                 }}
//                 styles={{ body: { marginTop: "17px" } }}
//               >
//                 <Title className="title-piechart">
//                   {t(`attendanceOverview`)}
//                 </Title>
//                 <Doughnut
//                   style={{ marginTop: "15px" }}
//                   data={data}
//                   options={options}
//                 ></Doughnut>
//               </Card>
//             </Col>
//             <Col className="bonus-graph">
//               <Card
//                 style={{
//                   boxShadow: "3.9px 7.8px 7.8px hsla(0, 0%, 69%, 0.407)",
//                   // height: "330px",
//                 }}
//               >
//                 <EmployeeLineGraph />
//               </Card>
//             </Col>
//           </Row>
//           <TaskGrid />
//         </div>
//         <div>
//           <div className="qoute-row">
//             <div>
//               <QouteCard />
//             </div>
//             <div className="calendar-col">
//               <CalendarGrid />
//             </div>
//           </div>
//         </div>
//       </Flex>
//     </>
//   );
// };

// export default EmployeeWelcomeGrid;

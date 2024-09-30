import { Doughnut } from "react-chartjs-2";
import { HrData } from "../DashboardPage";
import "../styles/HRWelcomeGrid.css";
import { Col, Button, Flex, Row, Card } from "antd";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { NavLink } from "react-router-dom";
import { useTranslation } from "react-i18next";
import Title from "antd/es/typography/Title";
import TaskGrid from "./TaskGrid";
import QouteCard from "./QouteCard";
import CalendarGrid from "./CalendarGrid";
import HrLineGraph from "./HrLineGraph";
import { LeftDataType, RemainingDays } from "../../Dismissed/types/Left";
import { useEffect, useState } from "react";
import useHttp from "../../../hooks/useHttp";
import { EmployeeDataType } from "../../Employment/types/Employee";
import Loader from "../../../components/Shared/Loader";
import EmployeeLineGraph from "./EmployeeLineGraph";
import { EvenType } from "../../Events/types/EventTypes";
import { getFromLocalStorage } from "../../../utils/utils";
import { devideEventsByMonth } from "../../Events/utils/utils";

ChartJS.register(ArcElement, Tooltip, Legend);

interface WelcomeGridProps {
	initialData: HrData[];
}

interface Item {
	title: string;
	content?: any;
	color: string;
	status: string;
}

interface Data {
	paragraph: string;
	days?: any;
}

const EVENTS_API = import.meta.env.REACT_APP_EVENTS_API;

export const WelcomeGrid: React.FC<WelcomeGridProps> = ({ initialData }) => {
	const options = {};
	const { t } = useTranslation();
	// const EVENT_API = import.meta.env.REACT_APP_EVENTS_API;
	const [tableData, setTableData] = useState<LeftDataType[]>([]);
	const [events, setEvents] = useState<EvenType[]>([]);
	const [isLoading, error, sendRequest] = useHttp();
	const userData = JSON.parse(localStorage.getItem("userData") || "{}");
	const [tableEmployeeData, setTableEmployeeData] = useState<EmployeeDataType>();
	const EmployeData = JSON.parse(localStorage.getItem("userData") || "{}").employID;
	// const [loadedEvents, setLoadedEvents] = useState();
	const { thsMonth } = devideEventsByMonth(events);

	const initialItem: Item[] = [
		{
			title: t("thisMonthsEvent"),
			content: thsMonth.length || undefined,
			color: "#474CCC",
			status: "pr",
		},
		{
			title: t("holidayEntitlement"),
			content: tableEmployeeData?.teamLeader || undefined,
			color: "#CA054D",
			status: "holiday",
		},
		{
			title: t("currentSalary"),
			content: tableEmployeeData?.salary || undefined,
			color: "#136F63",
			status: "pr",
		},
	];

	const holidayData: Data[] = [
		{
			paragraph: "Total",
			days: "",
		},
		{
			paragraph: "Taken",
			days: "",
		},
		{
			paragraph: "Remaining",
			days: "",
		},
	];
	const RemainingDays = import.meta.env.REACT_APP_REMAINING_DAYS_OFF;

	const [remainingDays, setRemainingDays] = useState<RemainingDays>();
	const { employID } = getFromLocalStorage("userData");

	useEffect(() => {
		sendRequest(
			{
				endpoint: `left`,
				headers: {
					"Content-Type": "application/json",
				},
			},
			(response) => {
				setTableData(response.data);
			},
		);

		sendRequest(
			{
				endpoint: EVENTS_API,
			},
			(responseData: EvenType[]) => {
				setEvents(responseData);
			},
		);

		sendRequest(
			{
				endpoint: `employees/${EmployeData}`,
			},
			(data: EmployeeDataType) => {
				setTableEmployeeData(data);
			},
		);

		sendRequest(
			{
				endpoint: `${RemainingDays}/${employID}`,
				headers: {
					"Content-Type": "application/json",
				},
			},

			setRemainingDays,
		);
	}, []);

	if (isLoading) {
		return <Loader />;
	}

	if (error) {
		return <div>Something went wrong!!</div>;
	}

	const onDays = remainingDays?.remainingDays;

	const data = {
		labels: ["Off", "On"],
		datasets: [
			{
				label: "Days",
				data: [25 - onDays!, onDays],
				backgroundColor: ["#FFBC42", "#73D2DE"],
			},
		],
	};

	return (
		<>
			<Flex className="welcome-grid" justify="center" gap={10}>
				<div>
					{userData.role === "hr" ? (
						<Flex className="hr-button-statistcs" justify="space-between">
							{initialData.map((data, index) => {
								return (
									<Col key={index} className="hr-buttons">
										<NavLink to={data.path}>
											<Button
												className="active-dashboard"
												style={{ backgroundColor: data.color, padding: "20px" }}
											>
												<Title className="hr-card-title">{data?.noEmployee}</Title>
												<h1 className="hr-card-status">{data.status}</h1>
											</Button>
										</NavLink>
									</Col>
								);
							})}
						</Flex>
					) : (
						<Flex justify="space-between">
							{initialItem.map((item, index) => {
								return (
									<Col key={index} className="hr-buttons">
										<Card className="active-dashboard" style={{ backgroundColor: item.color }}>
											<h2 className="hr-card-status">{item.title}</h2>
											{item.status === "holiday" ? (
												<Flex className="holiday-card">
													{holidayData.map((data, index) => {
														return (
															<div key={index}>
																<p
																	style={{
																		color: "white",
																		marginRight: "10px",
																		justifyContent: "center",
																	}}
																>
																	{data.paragraph}
																</p>
																<br />
																<p style={{ color: "white" }}>{data.days}</p>
															</div>
														);
													})}
												</Flex>
											) : (
												<h1
													style={{
														color: "white",
													}}
													className="card-text"
												>
													{item.content}
												</h1>
											)}
										</Card>
									</Col>
								);
							})}
						</Flex>
					)}
					<Row className="graph-row" style={{ gap: "20px", marginBottom: "20px" }}>
						<Col>
							<Card
								className="pie-chart"
								style={{
									height: "100%",
									boxShadow: "3.9px 7.8px 7.8px hsla(0, 0%, 69%, 0.407)",
								}}
								styles={{ body: { marginTop: "17px" } }}
							>
								<Title className="title-piechart">{t(`attendanceOverview`)}</Title>
								<Doughnut style={{ marginTop: "15px" }} data={data} options={options}></Doughnut>
							</Card>
						</Col>
						<Col className="bonus-graph">
							<Card
								style={{
									boxShadow: "3.9px 7.8px 7.8px hsla(0, 0%, 69%, 0.407)",
									// height: "330px",
								}}
							>
								{userData.role === "hr" ? <HrLineGraph /> : <EmployeeLineGraph />}
							</Card>
						</Col>
					</Row>
					<TaskGrid />
				</div>
				<div>
					<div className="qoute-row">
						<QouteCard />
					</div>
					<div className="calendar-col">
						<CalendarGrid />
					</div>
				</div>
			</Flex>
		</>
	);
};

export default WelcomeGrid;

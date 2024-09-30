import { Avatar, Card, Flex } from "antd";
import "../../styles/Navigation/LogedUserPanel.css";
import { Link } from "react-router-dom";
import { getFromLocalStorage, stringToHashCodeHelper } from "../../utils/utils";
import useHttp from "../../hooks/useHttp";
import { useEffect, useState, useContext } from "react";
import { EmployeeDataType } from "../../pages/Employment/types/Employee";
import { AvatarContext } from "../../store/AvatarContext";

const { Meta } = Card;

type LogedUserPanelProps = {
	colapsed: boolean;
};

const LogedUserPanel = ({ colapsed }: LogedUserPanelProps) => {
	const userData = getFromLocalStorage();
	const { logedEmployeDetails, fetchLogedUser } = useContext(AvatarContext);
	const color = stringToHashCodeHelper(userData?.employID);
	const hasProfilePicture = !!logedEmployeDetails?.profilePhoto;
	let fullName;

	useEffect(() => {
		fetchLogedUser();
	}, []);

	function renderAvatar() {
		if (hasProfilePicture) {
			return <Avatar size={"large"} src={logedEmployeDetails?.profilePhoto} />;
		} else {
			return (
				<Avatar
					size={"large"}
					style={{
						backgroundColor: color,
						color: "black",
						fontSize: "1.5rem",
					}}
				>
					{logedEmployeDetails?.name?.charAt(0)}
				</Avatar>
			);
		}
	}

	return (
		<>
			<Link to={"/profile"}>
				{!colapsed ? (
					<Card className="loged-user-card">
						<Meta
							avatar={renderAvatar()}
							title={logedEmployeDetails?.fullName}
							description={userData?.role.toUpperCase()}
							className="loged-user-panel"
						/>
					</Card>
				) : (
					<Flex className="colapsed-avatar-container" justify="center">
						{renderAvatar()}
					</Flex>
				)}
			</Link>
		</>
	);
};

export default LogedUserPanel;

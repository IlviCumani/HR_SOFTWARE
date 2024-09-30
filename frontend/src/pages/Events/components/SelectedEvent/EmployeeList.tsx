import { Avatar, List, Typography } from "antd";
import { t } from "i18next";
import { getFromLocalStorage, stringToHashCodeHelper } from "../../../../utils/utils";
import { EventParticipantsType } from "../../types/EventTypes";

export default function EmployeeList({ participants }: { participants: EventParticipantsType[] }) {
	const logedUser = getFromLocalStorage();
	function renderAvatar(profilePhoto: string | undefined, fullName: string, id: string) {
		if (profilePhoto) {
			return <Avatar src={profilePhoto} alt={fullName} />;
		}
		return (
			<Avatar
				style={{
					backgroundColor: stringToHashCodeHelper(id),
					color: "black",
					fontSize: "1.2rem",
					fontFamily: "Roboto",
				}}
				alt={fullName}
			>
				{fullName[0]}
			</Avatar>
		);
	}

	return (
		<section className="employee-list-container">
			<List
				header={
					<Typography.Title level={4}>
						<strong>{t("joinedEmployees")}:</strong> {participants.length}
					</Typography.Title>
				}
				size="small"
				itemLayout="horizontal"
				dataSource={participants}
				renderItem={(item: { fullName: string; _id: string; profilePhoto: string | undefined }) => (
					<List.Item>
						<List.Item.Meta
							title={<Typography.Text strong>{`${item.fullName} `}</Typography.Text>}
							avatar={renderAvatar(item.profilePhoto, item.fullName, item._id)}
						/>
						<Typography.Text>{`${
							item._id === logedUser?.employID ? `( ${t("you")} )` : ""
						}`}</Typography.Text>
					</List.Item>
				)}
			/>
		</section>
	);
}

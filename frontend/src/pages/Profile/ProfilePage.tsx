import { Avatar, Card, Flex } from "antd";
import Meta from "antd/es/card/Meta";
import "../Profile/style/ProfilePage.css";
import Button from "../../components/Shared/Button";
import { ButtonType } from "../../enums/Button";
import { useEffect, useState, useContext } from "react";
import EditProfile from "./components/EditProfile";
import { FaRegUser } from "react-icons/fa";
import { MdLocalPhone, MdOutlineBadge, MdOutlineEmail } from "react-icons/md";
import { RiMoneyEuroCircleLine } from "react-icons/ri";
import { CalendarOutlined } from "@ant-design/icons";
import useHttp from "../../hooks/useHttp";
import { EmployeeDataType } from "../Employment/types/Employee";
import SettingsPage from "../Settings/SettingsPage";
import Loader from "../../components/Shared/Loader";
import { useTranslation } from "react-i18next";
import { AvatarContext } from "../../store/AvatarContext";
import noImg from "../../assets/user-profile-icon-free-vector.jpg";

const API = import.meta.env.REACT_APP_EMPLOYEE_API;

interface Data {
	title: string;
	description?: any;
	icon?: any;
}

const ProfilePage: React.FC = () => {
	const userData = JSON.parse(localStorage.getItem("userData") || "{}");
	const { logedEmployeDetails, setAvatarUrl } = useContext(AvatarContext);
	const EmployeData = JSON.parse(localStorage.getItem("userData") || "{}").employID;
	const [isModalVisible, setIsModalVisible] = useState(false);
	const [isLoading, , sendRequest] = useHttp();
	const [tableData, setTableData] = useState<EmployeeDataType>();
	const { t } = useTranslation();

	useEffect(() => {
		sendRequest(
			{
				endpoint: `${API}/${EmployeData}`,
				headers: {
					"Content-Type": "application/json",
				},
			},
			setTableData,
		);
	}, []);

	const showModal = () => {
		setIsModalVisible(true);
	};

	const handleOk = () => {
		setIsModalVisible(false);
	};

	const handleCancel = () => {
		setIsModalVisible(false);
	};

	if (isLoading) {
		return <Loader />;
	}
	const handleImageUpload = (url: string) => {
		// setAvatarUrl(url);
	};

	const initialData: Data[] = [
		{
			title: t("name"),
			description: logedEmployeDetails?.name || undefined,
			icon: <FaRegUser style={{ color: "#246AFE" }} />,
		},
		{
			title: t("position"),
			description: logedEmployeDetails?.position || undefined,
			icon: <MdOutlineBadge style={{ color: "#246AFE" }} />,
		},
		{
			title: t("salary"),
			description: `${logedEmployeDetails?.salary}$` || undefined,
			icon: <RiMoneyEuroCircleLine style={{ color: "#246AFE" }} />,
		},
		{
			title: t("startingOn"),
			description: logedEmployeDetails?.startingDate || undefined,
			icon: <CalendarOutlined style={{ color: "#246AFE" }} />,
		},
		{
			title: t("Email"),
			description: logedEmployeDetails?.email || undefined,
			icon: <MdOutlineEmail style={{ color: "#246AFE" }} />,
		},
		{
			title: t("phoneNumber"),
			description: logedEmployeDetails?.phoneNumber || undefined,
			icon: <MdLocalPhone style={{ color: "#246AFE" }} />,
		},
	];

	return (
		<div>
			<Flex className="main-flex-profile">
				<Flex vertical>
					<Card className="avatar-profile-card">
						<div className="inside-profile-card">
							<div>
								<img className="profile-pic" src={logedEmployeDetails?.profilePhoto || noImg} />
							</div>
							<div>
								<h3 className="username-title-profile">{userData.username}</h3>
								<p>{userData.role.toUpperCase()}</p>
								<Button className="edit-button" type={ButtonType.PRIMARY} onClick={showModal}>
									{t("editProfile")}
								</Button>
								<EditProfile
									visible={isModalVisible}
									handleOk={handleOk}
									setIsModal={handleOk}
									handleCancel={handleCancel}
									currentData={tableData}
									onImageUpload={handleImageUpload}
									setTablaData={setTableData}
								/>
							</div>
						</div>
					</Card>
					<Card className="personal-info-card">
						{initialData.map((data) => {
							return (
								<Meta
									avatar={<Avatar className="avatar-personal-info" icon={data?.icon} />}
									className="meta-personal-info"
									title={data?.title}
									description={data?.description}
								/>
							);
						})}
					</Card>
				</Flex>
				<Flex>
					<SettingsPage />
				</Flex>
			</Flex>
		</div>
	);
};

export default ProfilePage;

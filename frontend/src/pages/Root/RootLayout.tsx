import { Outlet } from "react-router-dom";
import NavigationMenu from "../../components/Navigation/NavigationMenu";
import Header from "../../components/Header/Header";
import NavigationMenuLogo from "../../components/Navigation/NavigationMenuLogo";
import HeaderIcons from "../../components/Header/HeaderIcons";
import Trigger from "../../components/Navigation/Trigger";
import { ExclamationCircleOutlined } from "@ant-design/icons";
import { Flex, FloatButton } from "antd";
import { useNavigate } from "react-router-dom";
import { Layout } from "antd";
import "./Style/RootStyle.css";
import { getFromLocalStorage } from "../../utils/utils";
import AvatarContextProvider from "../../store/AvatarContext";

const { Content, Sider } = Layout;

import { useState, useEffect } from "react";
import { NotificationProvider } from "../../components/Notifications/context/useNotificationContext";

const RootLayout: React.FC = () => {
	const [colapsed, setColapsed] = useState<boolean>(false);
	const [isMobile, setIsMobile] = useState<boolean>(false);
	const token = getFromLocalStorage("userData");
	const navigate = useNavigate();

	useEffect(() => {
		if (token === null) {
			navigate("/");
		}
	}, []);

	function onCollapse() {
		setColapsed((prev) => !prev);
	}

	useEffect(() => {
		const handleResize = () => {
			if (window.innerWidth < 600) {
				setColapsed(true);
				setIsMobile(true);
			} else {
				setIsMobile(false);
			}
		};

		handleResize();

		window.addEventListener("resize", handleResize);

		return () => window.removeEventListener("resize", handleResize);
	}, []);

	return (
		<AvatarContextProvider>
			<Layout>
				<Flex vertical flex={1} className="root-page-container">
					<Header
						first={<NavigationMenuLogo logotext="HRSoftware" />}
						third={
							<NotificationProvider>
								<HeaderIcons />
							</NotificationProvider>
						}
					/>
					<Flex
						style={{
							height: "100%",
							overflow: "hidden",
						}}
					>
						<Sider
							collapsible
							collapsed={colapsed}
							onCollapse={onCollapse}
							collapsedWidth={90}
							className="sidebar-menu"
							width={300}
							theme={"light"}
							trigger={!isMobile ? <Trigger colapsed={colapsed} /> : null}
						>
							{/* {<LogedUserPanel colapsed={colapsed} />} */}
							<NavigationMenu colapsed={colapsed} />
						</Sider>

						<Content className="content-outlet-container">
							<FloatButton
								className="float-button "
								icon={<ExclamationCircleOutlined />}
								type="primary"
								style={{
									right: 25,
									bottom: 12,
									boxShadow: "3.9px 7.8px 7.8px hsl(0deg 0% 0% / 0.38)",
								}}
								onClick={() => navigate("/company-background")}
							/>

							<Outlet />
						</Content>
					</Flex>
				</Flex>
			</Layout>
		</AvatarContextProvider>
	);
};

export default RootLayout;

import Button from "../Shared/Button";
import { Flex, Menu } from "antd";
import { useLocation, useNavigate } from "react-router-dom";
import { Paths } from "../../utils/paths";
import "../../styles/Navigation/NavigationMenu.css";
import { LogoutOutlined } from "@ant-design/icons";
import { useTranslation } from "react-i18next";
import LogedUserPanel from "./LogedUserPanel";
import { isEmployee } from "../../utils/utils";
import { getMenuItemsByRole, getMenuItemType } from "../../utils/NavMenuHelper";

const NavigationMenu = ({ colapsed }: { colapsed: boolean }) => {
	const location = useLocation();
	const navigate = useNavigate();
	const isEmp = isEmployee();
	const { t } = useTranslation();
	const navElements = [
		Paths.Dashboard,
		...(isEmp ? [] : [Paths.Recruitment]),
		...(isEmp ? [] : [Paths.Employee]),
		Paths.Management,
		Paths.DayOff,
		Paths.Company,
	];

	const items: any = navElements.map((element, index) => {
		return {
			key: `${element.path} ${index}`,
			label: t(element.path),
			type: getMenuItemType(element, isEmp),
			icon: element.icon ? <element.icon className="nav-menu-icon" /> : null,
			children: element.children.map((subElement) => {
				return getMenuItemsByRole(element, subElement, isEmp);
			}),
		};
	});

	const handleLogOutClick = () => {
		localStorage.removeItem("userData");
		navigate("/");
	};

	const defaultSelectedKey = location.pathname.split("/").filter((x) => x);
	const [defaultSelect, defaultSubSelect] = defaultSelectedKey;
	const itemKey = items.find((item: any) => item.key.includes(defaultSelect));

	return (
		<Flex
			vertical
			align="stretch"
			justify="stretch"
			style={{
				height: "100%",
				width: "100%",
				overflow: "scroll",
			}}
		>
			<div className="top-menu-elements">
				<LogedUserPanel colapsed={colapsed} />
				<Menu
					className="side-nevigation-menu"
					defaultSelectedKeys={[defaultSubSelect ? defaultSubSelect : defaultSelect]}
					defaultOpenKeys={[itemKey?.key]}
					selectedKeys={[defaultSubSelect ? defaultSubSelect : defaultSelect]}
					spellCheck={true}
					mode="inline"
					items={items}
				/>
			</div>

			<div className="logout-button-container">
				<Button type="text" danger size="large" onClick={handleLogOutClick}>
					<LogoutOutlined />
					{!colapsed ? t(`logOut`) : ""}
				</Button>
			</div>
		</Flex>
	);
};

export default NavigationMenu;

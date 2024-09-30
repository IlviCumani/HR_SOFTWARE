import { NavLink } from "react-router-dom";
import { t } from "i18next";

export function getMenuItemsByRole(element: any, subelement: any, isEmp: boolean) {
	const pathObject = {
		key: `${subelement.path}`,
		label: <NavLink to={`${element.path}/${subelement.path}`}>{t(subelement.path)}</NavLink>,
		icon: <subelement.icon className="nav-menu-icon" />,
	};

	const isPathHrOnly = subelement.isHrOnly;

	if (!isPathHrOnly || (isPathHrOnly && !isEmp)) {
		return pathObject;
	}
}

export function getMenuItemType(element: any, isEmp: boolean) {
	const subelements = element.children;

	const subelementsForAll = subelements.filter((subelement: any) => {
		return !subelement.isHrOnly;
	});

	const itemsToShow = !isEmp ? subelements : subelementsForAll;

    return itemsToShow.length === 1 ? "group" : "";
}

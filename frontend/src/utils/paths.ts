import NavigationIcons from "./NavigationIcons";
import PageRoutesComponents from "../pages";

export const Paths = {
	Login: {
		path: "/",
		pageElement: PageRoutesComponents.LoginPage,
	},
	Dashboard: {
		path: "",
		type: "group",
		icon: null,
		children: [
			{
				isHrOnly: false,
				path: "dashboard",
				icon: NavigationIcons.AppstoreOutlined,
				pageElement: PageRoutesComponents.DashboardPage,
			},
		],
	},
	Recruitment: {
		path: "",
		type: "group",
		icon: null,
		children: [
			{
				isHrOnly: true,
				path: "recruitment",
				icon: NavigationIcons.MdOutlinePersonSearch,
				pageElement: PageRoutesComponents.RecruitmentPage,
			},
		],
	},
	Employee: {
		path: "",
		type: "group",
		icon: null,
		children: [
			// ...isOnlyHr("employee", NavigationIcons.UserOutlined, PageRoutesComponents.EmploymentPage),
			{
				isHrOnly: true,
				path: "employee",
				icon: NavigationIcons.UserOutlined,
				pageElement: PageRoutesComponents.EmploymentPage,
			},
		],
	},
	PersonalCalendar: {
		path: "personal-calendar",
		icon: NavigationIcons.CalendarOutlined,
		children: [
			{
				path: "",
				pageElement: PageRoutesComponents.PersonalCalendarPage,
			},
		],
	},
	Profile: {
		path: "profile",
		icon: NavigationIcons.UserOutlined,
		children: [
			{
				path: "",
				pageElement: PageRoutesComponents.ProfilePage,
			},
		],
	},
	Background: {
		path: "company-background",
		children: [
			{
				path: "",
				pageElement: PageRoutesComponents.CompanyBackgroundPage,
			},
		],
	},
	Management: {
		path: "managment",
		type: "",
		icon: NavigationIcons.Management,
		children: [
			{
				isOnlyHr: false,
				path: "salary",
				icon: NavigationIcons.RiMoneyEuroCircleLine,
				pageElement: PageRoutesComponents.SalariesPage,
			},
			{
				isHrOnly: true,
				path: "promotions",
				icon: NavigationIcons.PiChartLineUpBold,
				pageElement: PageRoutesComponents.PromotionPage,
			},
			{
				isHrOnly: true,
				path: "dismissed",
				icon: NavigationIcons.TbUserCancel,
				pageElement: PageRoutesComponents.DismissedPage,
			},
		],
	},
	DayOff: {
		path: "dayoff",
		type: "",
		icon: NavigationIcons.SandClock,
		children: [
			{
				isHrOnly: false,
				path: "requestedLeave",
				icon: NavigationIcons.VscRequestChanges,
				pageElement: PageRoutesComponents.RequestedLeavePage,
			},
			{
				isHrOnly: false,
				path: "calendarLeave",
				icon: NavigationIcons.BsCalendar4Range,
				pageElement: PageRoutesComponents.CalendarLeavePage,
			},
		],
	},
	Company: {
		path: "company",
		type: "",
		icon: NavigationIcons.Building,
		children: [
			{
				isHrOnly: false,
				path: "events",
				icon: NavigationIcons.MdOutlineEventAvailable,
				pageElement: PageRoutesComponents.EventPage,
			},
			{
				isHrOnly: false,
				path: "assets",
				icon: NavigationIcons.RiComputerLine,
				pageElement: PageRoutesComponents.AssetsPage,
			},
			{
				isHrOnly: false,
				path: "organisationalStructure",
				icon: NavigationIcons.ApartmentOutlined,
				pageElement: PageRoutesComponents.OrganisationalStructurePage,
			},
		],
	},
};

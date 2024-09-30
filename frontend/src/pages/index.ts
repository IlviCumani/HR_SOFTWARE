import LoginPAge from "./LoginPage";
import { lazy } from "react";

const PageRoutesComponents = {
  LoginPage: LoginPAge,
  DashboardPage: lazy(() => import("./Dashboard/DashboardPage")),
  PersonalCalendarPage: lazy(
    () => import("./PersonalCalendar/PersonalCalendarPage")
  ),
  CompanyBackgroundPage: lazy(
    () => import("./CompanyBackground/CompanyBackgroundPage")
  ),
  EventPage: lazy(() => import("./Events/EventPage")),
  AssetsPage: lazy(() => import("./Assets/AssetsPage")),
  OrganisationalStructurePage: lazy(
    () => import("./OrganisationalStructure/OrganisationalStructurePage")
  ),
  SalariesPage: lazy(() => import("./Salary/SalariesPage")),
  PromotionPage: lazy(() => import("./Promotion/PromotionPage")),
  RecruitmentPage: lazy(() => import("./Recruitments/RecruitmentPage")),
  EmploymentPage: lazy(() => import("./Employment/EmploymentPage")),
  DismissedPage: lazy(() => import("./DismissedPage")),
  RequestedLeavePage: lazy(() => import("./DayOff/RequestedLeavePage")),
  CalendarLeavePage: lazy(() => import("./CalendarLeaves/CalendarLeavePage")),
  SettingsPage: lazy(() => import("./Settings/SettingsPage")),
  ProfilePage: lazy(() => import("./Profile/ProfilePage")),
};

export default PageRoutesComponents;

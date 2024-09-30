import { createBrowserRouter, RouterProvider } from "react-router-dom";
import ErrorPage from "./pages/ErrorPage";
import RootLayout from "./pages/Root/RootLayout";
import { Paths } from "./utils/paths";
import Loader from "./components/Shared/Loader";
import { Suspense } from "react";

import "./App.css";
import { ConfigProvider } from "antd";

const iterationRoutes = [
	Paths.Dashboard,
	Paths.Recruitment,
	Paths.PersonalCalendar,
	Paths.Company,
	Paths.Management,
	Paths.Employee,
	Paths.Background,
	Paths.DayOff,
	Paths.Profile,
];

const router = createBrowserRouter([
	{
		path: Paths.Login.path,
		element: <Paths.Login.pageElement />,
	},
	{
		path: "/",
		element: <RootLayout />,
		errorElement: <ErrorPage />,
		children: [
			...iterationRoutes.map((route) => {
				return {
					path: route.path,
					children: route.children.map((child) => {
						return {
							path: child.path,
							element: (
								<Suspense fallback={<Loader />}>
									<child.pageElement />
								</Suspense>
							),
						};
					}),
				};
			}),
			{
				path: "*",
				element: <ErrorPage />,
			},
		],
	},
]);

function App() {
	return (
		<ConfigProvider
			theme={
				{
					// components: {
					//   Button: {
					//     colorPrimary: `linear-gradient(135deg, #30D3CB, #2A9BE6, #2A9BE6)`,
					//     colorPrimaryHover: `linear-gradient(135deg, #2A9BE6, #30D3CB, #2A9BE6 )`,
					//     colorPrimaryActive: "#f46efc",
					//   },
					// },
				}
			}
		>
			
			<RouterProvider router={router} />;
		</ConfigProvider>
	);
}

export default App;

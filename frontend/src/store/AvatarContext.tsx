import { createContext, useEffect, useState } from "react";
import useHttp from "../hooks/useHttp";
import { getFromLocalStorage } from "../utils/utils";
import { EmployeeDataType } from "../pages/Employment/types/Employee";

const API = import.meta.env.REACT_APP_EMPLOYEE_API;

export const AvatarContext = createContext({
	logedEmployeDetails: undefined as EmployeeDataType | undefined,
	setAvatarUrl: (_url: string, _phone: number) => {},
	fetchLogedUser: () => {},
});

export default function AvatarContextProvider({ children }: { children: React.ReactNode }) {
	const [logedEmployeDetails, setLogedUserDetails] = useState<EmployeeDataType | undefined>(
		undefined,
	);
	const [, , sendRequest] = useHttp();

	function handleAvatarChange(url: string, phone: number) {
		setLogedUserDetails((prev) => {
			if (prev) {
				return {
					...prev,
					profilePhoto: url,
					phoneNumber: phone,
				};
			}
			return prev;
		});
	}
	console.log(logedEmployeDetails, "logedEmployeDetails");

	useEffect(() => {
		fetchLogedUser();
	}, []);

	function fetchLogedUser() {
		const userData = getFromLocalStorage();

		sendRequest(
			{
				endpoint: `${API}/${userData?.employID}`,
			},
			(response: EmployeeDataType) => {
				setLogedUserDetails(response);
			},
		);
	}

	const ctx = {
		logedEmployeDetails,
		setAvatarUrl: handleAvatarChange,
		fetchLogedUser,
	};

	return <AvatarContext.Provider value={ctx}>{children}</AvatarContext.Provider>;
}

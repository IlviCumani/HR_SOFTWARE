import DismissedTable from "./Dismissed/components/DismissedTable";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { isEmployee } from "../utils/utils";

const DismissedPage: React.FC = () => {
	const navigate = useNavigate();
	const isEmp = isEmployee();

	useEffect(() => {
		if (isEmp) {
			navigate("/error");
		}
	}, [isEmp]);
	return (
		<div>
			<DismissedTable />
		</div>
	);
};

export default DismissedPage;

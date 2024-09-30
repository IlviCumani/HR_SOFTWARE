import { RecruitmentProvider } from "./context";
import { RecruitmentContent } from "./RecruitmentContent";
import { isEmployee } from "../../utils/utils";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const RecruitmentPage: React.FC = () => {
	const isEmp = isEmployee();
	const navigate = useNavigate();

	useEffect(() => {
		if (isEmp) {
			navigate("/error");
		}
	}, [isEmp]);

	return (
		<RecruitmentProvider>
			<RecruitmentContent />
		</RecruitmentProvider>
	);
};

export default RecruitmentPage;

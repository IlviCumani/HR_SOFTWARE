import { Result } from "antd";
import NoDataImg from "../../../assets/Empty-pana.svg";
import ErrorImg from "../../../assets/Computer troubleshooting-bro.svg";

type NoDataResultProps = {
	isError?: boolean;
};

const NoDataResult = ({ isError = false }: NoDataResultProps) => {
	const msg = isError ? "Something went wrong!" : "There are no events for this month.";

	return (
		<Result
			title={isError ? "Error" : "No Events"}
			subTitle={msg}
			icon={<img className="no-data-img" src={isError ? ErrorImg : NoDataImg} alt="Error" />}
		/>
	);
};

export default NoDataResult;

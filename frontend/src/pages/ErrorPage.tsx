import { Flex, Result } from "antd";
import ErrorImage from "../assets/404.svg";

export default function ErrorPage() {
	return (
		<Flex
			vertical
			justify="center"
			align="center"
			style={{
				height: "90vh",
			}}
		>
			<Result
				// status="404"
				title="The World is on fire!🔥"
				icon={<img src={ErrorImage} alt="fire" />}
				subTitle="Sorry, the page you visited does not exist or you don't have permission to enter."
			/>
		</Flex>
	);
}

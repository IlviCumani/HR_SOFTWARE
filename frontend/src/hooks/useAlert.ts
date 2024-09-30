import { notification } from "antd";
import { t } from "i18next";

type AlertProps = {
	displayDescription: string;
	displayTitle?: string;
	duration?: number;
	type: "error" | "success" | "info" | "warning";
};

export default function useAlert({
	displayDescription,
	displayTitle,
	duration = 1.7,
	type = "info",
}: AlertProps) {
	const [message, contextHolder] = notification.useNotification();

	function handleAlert() {
		message.open({
			message: displayTitle,
			description: displayDescription,
			duration: duration,
			showProgress: true,
			type: type,
		});
	}

	return { handleAlert, contextHolder };
}

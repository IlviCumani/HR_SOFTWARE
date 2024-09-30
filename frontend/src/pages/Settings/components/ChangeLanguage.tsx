import { Button, Card, Switch } from "antd";
import { t } from "i18next";
import { useTranslation } from "react-i18next";
import { IoNotificationsOffOutline, IoNotificationsOutline } from "react-icons/io5";
import { setToLocalStorage } from "../../../utils/utils";
import { getFromLocalStorage } from "../../../utils/utils";

export default function ChangeLanguage() {
	const { i18n } = useTranslation();
	const selectedLanguage = getFromLocalStorage("language") || "en";

	const languagge = [
		{ code: "sq", title: "Albanian" },
		{ code: "en", title: "English" },
	];

	const changeLanguage = (code: string) => {
		setToLocalStorage("language", code);
		i18n.changeLanguage(code);
	};

	return (
		<div style={{ margin: 20, alignItems: "center" }}>
			<Card
				title={t(`general`)}
				// style={{ width: "750px" }}
				styles={{ body: { display: "flex", flexDirection: "column" } }}
			>
				<div style={{ display: "flex", justifyContent: "space-between" }}>
					<div style={{ fontSize: 15, fontWeight: "bold", width: "200px" }}>
						{t("changeWebsiteLanguage")}
					</div>
					<div style={{ alignItems: "center" }}>
						{languagge.map((lang) => (
							<Button
								type={selectedLanguage === lang.code ? "primary" : "default"}
								style={{ float: "right", marginLeft: "10px" }}
								onClick={() => changeLanguage(lang.code)}
							>
								{lang.title}
							</Button>
						))}
					</div>
				</div>
				<div
					style={{
						display: "flex",
						justifyContent: "space-between",
						marginTop: "10px",
					}}
				></div>
				<div
					style={{
						display: "flex",
						justifyContent: "space-between",
						marginTop: "10px",
					}}
				>
					<div style={{ fontSize: 15, fontWeight: "bold" }}>{t(`enableNotifications`)}</div>
					<Switch
						style={{ float: "right" }}
						defaultChecked
						// onChange={onChange}
						checkedChildren={<IoNotificationsOutline />}
						unCheckedChildren={<IoNotificationsOffOutline />}
					/>
				</div>
			</Card>
		</div>
	);
}

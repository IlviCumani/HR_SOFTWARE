import { Flex, Row, Col } from "antd";
import FormInputs from "../../../components/Shared/InputTypes/FormInputs";

import { useTranslation } from "react-i18next";

const FirstPanel = () => {
	const { t } = useTranslation();
	return (
		<Flex vertical>
			<Row gutter={16}>
				<Col xs={{ offset: 1, span: 23 }} md={{ offset: 1, span: 10 }}>
					<FormInputs.Input label={t("name")} name="name" required />
				</Col>
				<Col xs={{ offset: 1, span: 23 }} md={{ offset: 1, span: 10 }}>
					<FormInputs.Input label={t("surname")} name="surname" required />
				</Col>
			</Row>
			<Row>
				<Col xs={{ offset: 1, span: 23 }} md={{ offset: 1, span: 10 }}>
					<FormInputs.Input
						label="Email"
						addonAfter="@codevider.com"
						name="email"
						required
						// defaultValidateRule="email"
					/>
				</Col>
				<Col xs={{ offset: 1, span: 23 }} md={{ offset: 1, span: 10 }}>
					<FormInputs.Input
						label={t("phoneNumber")}
						name="phoneNumber"
						required
						defaultValidateRule="phoneNumber"
					/>
				</Col>
			</Row>
			<Row gutter={10}>
				<Col xs={{ offset: 1, span: 23 }} md={{ offset: 1, span: 5 }}>
					<FormInputs.Input
						label={t("personalNumber")}
						name="nID"
						required
						defaultValidateRule="personalNumber"
					/>
				</Col>
				<Col xs={{ offset: 1, span: 23 }} md={{ offset: 0, span: 5 }}>
					<FormInputs.DatePicker
						label={t("birthDate")}
						name="birthDay"
						required
						disableFuture
						isDisabledDate
					/>
				</Col>
				<Col xs={{ offset: 1, span: 23 }} md={{ offset: 1, span: 10 }}>
					<FormInputs.Select
						label={t("gender")}
						name="gender"
						options={[
							{ label: t("male"), value: "Male" },
							{ label: t("female"), value: "Female" },
						]}
						required
					/>
				</Col>
			</Row>
		</Flex>
	);
};

export default FirstPanel;

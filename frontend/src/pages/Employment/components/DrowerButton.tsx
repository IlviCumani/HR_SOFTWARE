import { Row, Col, Space } from "antd";
import Button from "../../../components/Shared/Button";
import { ButtonType } from "../../../enums/Button";
import { t } from "i18next";

type DrowerButtonProps = {
	current: number;
	item: any[];
	onChange: (value: number) => void;
	onFinish: () => void;
};

const DrowerButton = ({ current, item, onChange, onFinish }: DrowerButtonProps) => {
	return (
		<Row>
			<Col offset={1}>
				{current !== 2 && (
					<Space
						style={{
							marginBottom: "20px",
						}}
					>
						{current > 0 && <Button onClick={() => onChange(-1)}> {t("back")}</Button>}
						<Button
							type={ButtonType.PRIMARY}
							onClick={current === item.length - 2 ? onFinish : () => onChange(1)}
						>
							{current === item.length - 2 ? t("finish") : t("next")}
						</Button>
					</Space>
				)}
			</Col>
		</Row>
	);
};

export default DrowerButton;

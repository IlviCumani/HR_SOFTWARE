import { Row, Col, Select, Button } from "antd";
import { ButtonType } from "../../../enums/Button";
import { menuItems, positions, referenceItems } from "../columns/constants";
import Search from "antd/lib/input/Search";
import { useRecruitmentContext } from "../context";
import { t } from "i18next";

const Filters = () => {
	const { filters, updateFilter, clearFilters } = useRecruitmentContext();
	return (
		<Row gutter={[10, 10]} align="stretch" style={{ maxWidth: "100%", padding: "10px" }}>
			<Col>
				<Search
					placeholder={t("searchApplicant")}
					style={{ width: 300 }}
					enterButton
					allowClear
					onSearch={(value) => {
						const [name, surname] = value.split(" ");
						updateFilter("name", name || null);
						updateFilter("surname", surname || null);
					}}
				/>
			</Col>
			<Col>
				<Select
					allowClear
					placeholder={t("selectStage")}
					style={{ width: 200 }}
					options={menuItems?.map((item) => ({
						label: t(item?.label),
						value: item?.key,
					}))}
					value={filters.stage}
					onChange={(value) => updateFilter("stage", value)}
				/>
			</Col>
			<Col>
				<Select
					allowClear
					placeholder={t("referenceSelect")}
					style={{ width: 200 }}
					options={referenceItems?.map((item) => ({
						label: item?.label,
						value: item?.key,
					}))}
					value={filters.reference}
					onChange={(value) => updateFilter("reference", value)}
				/>
			</Col>
			<Col>
				<Select
					allowClear
					placeholder={t("selectPosition")}
					style={{ width: 200 }}
					options={positions}
					onChange={(value) => updateFilter("position", value)}
					value={filters.position}
				/>
			</Col>
			<Col>
				<Button onClick={clearFilters} type={ButtonType.PRIMARY}>
					{t("clearFilters")}
				</Button>
			</Col>
		</Row>
	);
};

export default Filters;

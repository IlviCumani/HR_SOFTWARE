import { Row, Col, Space, Button, DatePicker, Input, message } from "antd";
import { useEffect, useState } from "react";
import dayjs, { Dayjs } from "dayjs";
import { useSalaryHook } from "../context/hook";
import { useTranslation } from "react-i18next";
import Axios from "../../../helpers/axios";
import { AxiosError } from "axios";
import { Salary } from "../../../types/SalaryProps";
import Modal from "../../../components/Shared/Modal";
import { isHR } from "../../../utils/utils";

const { RangePicker } = DatePicker;
const { Search } = Input;

const FilterComponent = () => {
	const { t } = useTranslation();
	const startOfMonth = dayjs().startOf("month");
	const endOfMonth = dayjs().endOf("month");
	const [selectedRange, setSelectedRange] = useState<[Dayjs, Dayjs]>([startOfMonth, endOfMonth]);
	const [isModalVisible, setIsModalVisible] = useState<boolean>(false);
	const { setFilters, filters, tableData, setTableData } = useSalaryHook();
	const [searchValue, setSearchValue] = useState<string>("");
	const handleSearch = (value: string) => {
		setSearchValue(value);
		setFilters({ ...filters, name: value.trim() });
	};
	const isHr = isHR();

	useEffect(() => {
		setFilters({
			...filters,
			startDate: startOfMonth,
			endDate: endOfMonth,
		});
	}, []);
	const handleRangeChange = (dates: [Dayjs | null, Dayjs | null] | null) => {
		if (dates) {
			const [start, end] = dates;
			setSelectedRange([start!, end!]);
			setFilters({
				...filters,
				startDate: start!.startOf("month"),
				endDate: end!.endOf("month"),
			});
		}
	};

	const handleResetFilters = () => {
		setSelectedRange([startOfMonth, endOfMonth]);
		setSearchValue("");
		setFilters({
			startDate: startOfMonth,
			endDate: endOfMonth,
		});
	};

	const handleCompensation = async () => {
		try {
			await Axios.post("/salary/compensate");
			message.success("Employees compensated sucessfully");
			setTableData(
				tableData.map((salary: Salary) => {
					return { ...salary, paid: true };
				}),
			);
		} catch (error) {
			if (error instanceof AxiosError) {
				message.error(error.response?.data.errorDetails.message ?? "An unexpected error happened");
			}
		}
	};

	const handleOk = () => {
		setIsModalVisible(false);
		handleCompensation();
	};

	return (
		<>
			<Row gutter={10} title="Filters" style={{ justifyContent: "space-between" }}>
				<Col>
					<Space direction="vertical" size={12}>
						<RangePicker
							picker="month"
							value={selectedRange}
							defaultValue={[startOfMonth, endOfMonth]}
							onCalendarChange={handleRangeChange}
							allowClear={false}
						/>
					</Space>
				</Col>
				<Col>
					<Search
						placeholder={t("enterEmployeeName")}
						style={{ width: 300 }}
						onSearch={handleSearch}
						enterButton
						allowClear
						value={searchValue}
						onChange={(e) => setSearchValue(e.target.value)}
					/>
				</Col>
				<Col flex="1" style={{ textAlign: "left" }}>
					<Button type="primary" onClick={handleResetFilters}>
						{t("resetFilters")}
					</Button>
				</Col>
				{isHr && (
					<Col>
						<Button type="primary" onClick={() => setIsModalVisible(true)}>
							{"Compensate All"}
						</Button>
					</Col>
				)}
			</Row>

			<Modal
				title="Confirm Compensation"
				onOk={handleOk}
				onCancel={() => setIsModalVisible(false)}
				isOpen={isModalVisible}
			>
				<p>Are you sure you want to compensate all employees?</p>
			</Modal>
		</>
	);
};

export default FilterComponent;

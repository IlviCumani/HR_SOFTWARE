import React, { useState, useEffect } from "react";
import { Button, Col, Row, Form, Drawer } from "antd";
import Steps from "../../../components/Shared/Steps";
import { findStepIndex, RecruitmentStage } from "../columns/constants";
import { useRecruitmentContext } from "../context";
import moment from "moment";
import ProfileCard from "./ProfileCard";
import ApplicantForm from "./form/ApplicantForm";
import { Typography } from "antd";
import { UserOutlined, SolutionOutlined, ProfileOutlined, SmileOutlined } from "@ant-design/icons";
import InterviewForm from "./form/InterviewForm";
import OfferMadeForm from "./form/OfferMadeForm";
import EmailContent from "./EmailContent";
import AddEmployeeForm from "../../Employment/components/AddEmployeeForm";
import RejectDrawer from "./RejectDrawer";
import { t } from "i18next";
import { EmployeeDetails } from "../../../types/EmployeeDetailsProps";

const { Title } = Typography;

const Stepper: React.FC = () => {
  const { editingRecord, updateApplicant, createApplicant, form } =
    useRecruitmentContext();
  const [current, setCurrent] = useState(
    findStepIndex(editingRecord?.stage ?? RecruitmentStage.Applied)
  );
  const [childrenDrawer, setChildrenDrawer] = useState(false);
  const [employmentDrawer, setEmploymentDrawer] = useState(false);
  const [interviewers, setInterviewers] = useState<EmployeeDetails[]>([]);

  useEffect(() => {
    if (editingRecord) {
      const stage =
        current === 1
          ? editingRecord.firstInterview
          : current === 2
          ? editingRecord.secondInterview
          : null;
      if (stage) {
        form.setFieldsValue({
          ...stage,
          interviewers: stage.interviewers,
          date: stage.date ? moment(stage.date) : null,
        });
      }
    } else {
      form.resetFields();
      setCurrent(0);
    }
  }, [editingRecord, current, form]);

  const handleInterviewersChange = (newInterviewers: EmployeeDetails[]) => {
    setInterviewers(newInterviewers);
  };

	const handleSave = async () => {
		try {
			await form.validateFields();
			const formData = form.getFieldsValue();

			const submissionData = {
				...formData,
				interviewers: interviewers,
			};

			if (editingRecord) {
				updateApplicant(editingRecord._id, submissionData, current);
			} else {
				createApplicant(submissionData);
			}
		} catch (error) {
			console.error("Validation failed:", error);
		}
	};

	const items = [
		{
			title: t(RecruitmentStage.Applied),
			icon: <UserOutlined />,
			content: <ApplicantForm />,
		},
		{
			title: t(RecruitmentStage.FirstInterview),
			icon: <SolutionOutlined />,
			content: (
				<InterviewForm
					step={t(RecruitmentStage.FirstInterview)}
					onInterviewersChange={handleInterviewersChange}
				/>
			),
		},
		{
			title: t(RecruitmentStage.SecondInterview),
			icon: <ProfileOutlined />,
			content: (
				<InterviewForm
					step={t(RecruitmentStage.SecondInterview)}
					onInterviewersChange={handleInterviewersChange}
				/>
			),
		},
		{
			title: t(RecruitmentStage.OfferMade),
			icon: <SmileOutlined />,
			content: <OfferMadeForm />,
		},
	];

	const disabledForm = [RecruitmentStage.Hired, RecruitmentStage.Rejected].includes(
		editingRecord?.stage,
	);

	return (
		<>
			{editingRecord && (
				<>
					<ProfileCard />
					<div style={{ padding: "16px 1px" }}>
						{editingRecord.stage !== RecruitmentStage.Rejected && (
							<Steps
								onChange={setCurrent}
								current={current}
								direction="horizontal"
								responsive
								items={items.map(({ title, icon }) => ({ title, icon }))}
							/>
						)}
					</div>
				</>
			)}
			<div>
				<Form form={form} layout="vertical" disabled={disabledForm}>
					{editingRecord && <div style={{ justifyItems: "inherit" }}>{items[current].content}</div>}

					{!editingRecord && (
						<Form.Item>
							<Title level={4}>Add Applicant</Title>
							<ApplicantForm />
						</Form.Item>
					)}

					<Row gutter={6} style={{ marginTop: 16 }}>
						<Col>
							<Form.Item>
								<Button type="primary" htmlType="submit" onClick={handleSave}>
									{t("save")}
								</Button>
							</Form.Item>
						</Col>
						{editingRecord && (
							<>
								<Col>
									<Form.Item>
										<Button type="default" onClick={() => setChildrenDrawer(true)}>
											{t("notify")}
										</Button>
									</Form.Item>
									<Drawer
										title={`${t("notify")} ${editingRecord.name} ${editingRecord.surname}`}
										width={"30%"}
										closable={true}
										onClose={() => setChildrenDrawer(false)}
										open={childrenDrawer}
									>
										<EmailContent
											onCancel={() => setChildrenDrawer(false)}
											isForRejection={false}
										/>
									</Drawer>
								</Col>
								<Col flex="auto">
									<Row justify="end" style={{ width: "100%" }} gutter={8}>
										<Col>
											<RejectDrawer />
										</Col>
										{current === 3 && (
											<Col>
												<Button type="primary" onClick={() => setEmploymentDrawer(true)}>
													{t("hire")}
												</Button>
												<Drawer
													width="100%"
													onClose={() => setEmploymentDrawer(false)}
													open={employmentDrawer}
												>
													<AddEmployeeForm
														applicant={true}
														selectedEmployee={editingRecord}
														onAdd={() => {}}
														onEdit={() => {}}
													/>
												</Drawer>
											</Col>
										)}
									</Row>
								</Col>
							</>
						)}
					</Row>
				</Form>
			</div>
		</>
	);
};

export default Stepper;

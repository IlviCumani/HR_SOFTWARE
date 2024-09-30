import Modal from "../../../components/Shared/Modal";
import { Col, Form, Row, message } from "antd";
import { useRecruitmentContext } from "../context";
import FormInputs from "../../../components/Shared/InputTypes/FormInputs";

const FetchApplicantsModal = () => {
  const [form] = Form.useForm();
  const { isModalVisible, setIsModalVisible, handleModalOk } =
    useRecruitmentContext();

  const handleOk = () => {
    try {
      form.validateFields().then((values) => {
        handleModalOk(values.startDate?.format("YYYY-MM-DD"), values.subject);
        setIsModalVisible(false);
      });
    } catch (errorInfo) {
      message.error("Please fill in the required fields.");
    }
  };

  return (
    <Modal
      title="Fetch applicants from Gmail"
      isOpen={isModalVisible}
      onOk={handleOk}
      onCancel={() => setIsModalVisible(false)}
      infoTooltipText="This functionality is used for fetching the applicant from your Gmail account"
    >
      <Form
        form={form}
        layout="vertical"
        initialValues={{ subject: "", startDate: null }}
      >
        <Col>
          <Row>
            <FormInputs.DatePicker
              placeholder="Start date of filtering"
              label={"Start Date"}
              name={"startDate"}
              required
              disableFuture
              isDisabledDate
            />
          </Row>
          <Row>
            <FormInputs.Input
              placeholder="Filter by subject"
              name="subject"
              label="Subject"
              required
            />
          </Row>
        </Col>
      </Form>
    </Modal>
  );
};

export default FetchApplicantsModal;

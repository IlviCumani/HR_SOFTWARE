import { Button, Col, Form, Input, Row } from "antd";
import { MutableRefObject, useContext } from "react";
import Modal from "../../../components/Shared/Modal";
import { ModalContext, SalaryContext } from "../context";
import Title from "../../../components/Shared/Title";

interface AddBonusProps {
  addBonusRef: MutableRefObject<any>;
  handleAddBonusSubmit: (values: any) => void;
}

const AddBonusModal: React.FC<AddBonusProps> = ({
  addBonusRef,
  handleAddBonusSubmit,
}) => {
  const { selectedSalary } = useContext(SalaryContext)!;
  const { isAddBonusModalOpen, setIsAddBonusModalOpen } =
    useContext(ModalContext)!;

  if (!selectedSalary) {
    return null;
  }

  return (
    <Modal
      isOpen={isAddBonusModalOpen}
      title="Add bonuses"
      onCancel={() => setIsAddBonusModalOpen(false)}
      onOk={() => addBonusRef.current.submit()}
    >
      <Form
        ref={addBonusRef}
        id="add-bonus-form"
        onFinish={handleAddBonusSubmit}
        style={{ padding: 20 }}
        initialValues={{
          ...selectedSalary,
          bonuses:
            selectedSalary.bonuses?.map((bonus, index) => ({
              ...bonus,
              key: index.toString(),
            })) || [],
        }}
      >
        <Row>
          <Col span={10}>
            <Title key={3} title={"Description"} />
          </Col>
          <Col>
            <Title title={"Amount"} />
          </Col>
        </Row>{" "}
        <Form.List name="bonuses">
          {(fields, { add, remove }) => (
            <>
              {fields.map(({ key, name, ...restField }) => (
                <div
                  key={key}
                  style={{ display: "flex", alignItems: "center" }}
                >
                  <Form.Item
                    {...restField}
                    name={[name, "desc"]}
                    rules={[
                      {
                        required: true,
                        message: "Missing bonus description",
                      },
                    ]}
                    style={{ flex: 1, marginRight: 8 }}
                  >
                    <Input placeholder="Bonus Description" />
                  </Form.Item>
                  <Form.Item
                    {...restField}
                    name={[name, "amount"]}
                    rules={[
                      { required: true, message: "Missing bonus amount" },
                    ]}
                    style={{ flex: 1, marginRight: 8 }}
                  >
                    <Input type="number" placeholder="Bonus Amount" />
                  </Form.Item>
                  <Button
                    type="default"
                    danger
                    style={{ marginBottom: "25px" }}
                    onClick={() => remove(name)}
                  >
                    Remove
                  </Button>
                </div>
              ))}
              <Form.Item>
                <Button
                  type="default"
                  onClick={() => add()}
                  style={{
                    width: "30%",
                    float: "right",
                    color: "#2A9BE6",
                  }}
                >
                  Add new bonus
                </Button>
              </Form.Item>
            </>
          )}
        </Form.List>
      </Form>
    </Modal>
  );
};

export default AddBonusModal;

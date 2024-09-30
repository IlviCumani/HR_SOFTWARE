import { Col, Flex, Row } from "antd";
import "../../styles/Header/Header.css";
import { HeaderProps } from "../../types/HeaderProps";

const Header = ({ first, second, third }: HeaderProps) => {
  return (
    <Row align={"middle"} justify={"center"} className="header">
      {first && (
        <Col xs={{ span: 12 }} md={{ span: 8 }}>
          <Flex justify={"start"} align="flex-start">
            {first}
          </Flex>
          {/* {first} */}
        </Col>
      )}
      {second ? (
        <Col xs={{ span: 12 }} md={{ span: 8 }}>
          <Flex justify={"center"} align="center">
            {second}
          </Flex>
        </Col>
      ) : (
        <Col md={{ offset: 8 }}></Col>
      )}
      {third && (
        <Col xs={{ span: 12 }} md={{ span: 8 }}>
          <Flex justify={"end"} align="center">
            {third}
          </Flex>
        </Col>
      )}
    </Row>
  );
};

export default Header;

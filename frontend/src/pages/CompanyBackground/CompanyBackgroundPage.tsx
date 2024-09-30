import React from "react";
import { Avatar, Button, Card, Col, Flex, Row, Steps, Typography } from "antd";
import "../CompanyBackground/style/CompanyBackground.css";
import { PiBuildingApartmentLight } from "react-icons/pi";
import { FaRegUser } from "react-icons/fa";
import { MdOutlineBadge } from "react-icons/md";
import Meta from "antd/es/card/Meta";
import CEO from "../../assets/ceo.jpeg";
import FM from "../../assets/ervin.jpeg";
const cardStyle: React.CSSProperties = {
  margin: "auto",
  marginTop: "20px",
  display: "flex",
  flexDirection: "column",
  justifyContent: "flex-end",
  height: "300px",
};

interface Data {
  title?: string;
  description?: string;
  avatar?: any;
}

const { Title } = Typography;

const CompanyBackgroundPage: React.FC = () => {
  const initialData: Data[] = [
    {
      title: "Pasho Toska",
      description: "CEO",
      avatar: <Avatar className="aboutus-avatar" size={"large"} src={CEO} />,
    },
    {
      title: "Ervin Ziko",
      description: "Finance Manager",
      avatar: <Avatar className="aboutus-avatar" size={"large"} src={FM} />,
    },
    {
      title: "Erion Domi",
      description: "Multinational Manager",
      avatar: <Avatar className="aboutus-avatar" size={"large"} src={""} />,
    },
    {
      title: "Altin Luli",
      description: "Outsorcing Manager",
      avatar: <Avatar className="aboutus-avatar" size={"large"} src={""} />,
    },
  ];

  return (
    <Flex className="company-main-flex">
      <Card style={cardStyle} bordered={false} className="about-us">
        <div className="about-us-inner">
          <Title className="about-us-title" level={2}>
            About Us
          </Title>
          <p className="about-us-para">
            <b>CodeVider</b> is a leading provider of cutting-edge technology
            solutions, dedicated to empowering businesses of all sizes. With a
            focus on innovation and customer success, we strive to transform the
            way organizations operate and thrive in the digital landscape.
          </p>
        </div>
      </Card>
      <Title style={{ marginLeft: "40px" }} level={3}>
        Our Journey
      </Title>
      <Steps
        direction="vertical"
        status="wait"
        items={[
          {
            title: "Company founded",
            description: "July 2020",
            icon: <PiBuildingApartmentLight />,
          },
          {
            title: "First customers",
            description: "Sep 2020",
            icon: <FaRegUser />,
          },
          {
            title: "Hired first employee",
            description: "Oct 2020",
            icon: <MdOutlineBadge />,
          },
        ]}
      />
      <Typography>
        <Title className="mission-title" style={{ marginLeft: "40px" }} level={3}>
          Our Mission
        </Title>
        <p className="mission-para">
          We believe that everyone should have the opportunity to work with a
          great team. That's why we're building a platform that helps companies
          find and hire the best talent, and helps job seekers find the right
          team for them. Our mission is to make it easier for everyone to build
          and join great teams, so that more people can do the work they love.
        </p>
      </Typography>
      <Title style={{ marginLeft: "40px" }} level={3}>
        Boarding Managment
      </Title>
      <Flex className="ceo-cards">
        <Row gutter={[16, 16]}>
          {initialData.map((data) => {
            return (
              <Col
                span={12}
                xs={24}
                sm={24}
                md={12} 
                lg={12} 
                xl={12}
              >
                <Card
                  bordered={false}
                  style={{ width: "400px", marginLeft: "40px" }}
                >
                  <Meta
                    avatar={data?.avatar}
                    title={data?.title}
                    description={data?.description}
                  />
                </Card>
              </Col>
            );
          })}
        </Row>
      </Flex>
    </Flex>
  );
};

export default CompanyBackgroundPage;
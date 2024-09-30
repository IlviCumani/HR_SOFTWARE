import { Card, ConfigProvider } from "antd";
import { PromoteType } from "../types/PromoteType";
import { useEffect, useState } from "react";
// import useHttp from "../../../hooks/useHttp";
// import Loader from "../../../components/Shared/Loader";
import moment from "moment";
import { useTranslation } from "react-i18next";
import Button from "../../../components/Shared/Button";
import ReactCardFlip from "react-card-flip";

// const API = import.meta.env.REACT_APP_EMPLOYEE_API;

type PromoteCardProps = {
  promote?: PromoteType;
};
const PromoteCard = ({ promote }: PromoteCardProps) => {
  const { t } = useTranslation();
  // const [isLoading, error, sendRequest] = useHttp();
  const [isFlipped, setIsFlipped] = useState(false);

  // useEffect(() => {
  //   sendRequest(
  //     {
  //       url: `${API}/${EmployeData}`,
  //       headers: {
  //         "Content-Type": "application/json",
  //       },
  //     },
  //     setTableData,
  //   );
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, []);

  // if (isLoading) {
  //   return <Loader />;
  // }

  // if (error) {
  //   return <div>Something went wrong!!</div>;
  // }

  const handleClick = () => {
    setIsFlipped(!isFlipped);
  };

  const formatDate = (dateInput?: string | Date) => {
    if (!dateInput) return "No date provided";
    const formattedDate = moment(dateInput).format("DD/MM/YYYY");
    return formattedDate === "Invalid date"
      ? "Invalid date format"
      : formattedDate;
  };

  return (
    <div
      style={{
        display: "flex",
        marginBottom: "20px",
        marginRight: "20px",
        width: "300px",
      }}
    >
      <ConfigProvider
        theme={{
          components: {
            Card: {
              borderRadius: 10,
            },
          },
        }}
      >
        <div style={{ width: "300px" }}>
          <ReactCardFlip isFlipped={isFlipped} flipDirection="horizontal">
            <div>
              <Card
                title={promote?.employeeName}
                style={{ width: "100%" }}
                styles={{
                  header: { backgroundColor: "#24A2FE", color: "white" },
                  body: {
                    paddingTop: "0",
                    paddingBottom: "0",
                    display: "flex",
                    flexDirection: "column",
                  },
                }}
                hoverable
              >
                <p>
                  <b>{t("oldPosition")}:</b> {promote?.oldPosition}
                </p>
                <p>
                  <b>{t("dateOfHire")}:</b> {formatDate(promote?.dateOfHire)}
                </p>

                <p>
                  <b>{t("salary")}:</b> {promote?.oldSalary}
                </p>
                <p>
                  <b>{t("trainedBy")}:</b> {promote?.trainedBy}
                </p>
                <Button
                  type="primary"
                  onClick={handleClick}
                  style={{ marginBottom: "10px" }}
                >
                  {t("viewNewPromotion")}
                </Button>
              </Card>
            </div>
            <div style={{ width: "300px" }}>
              <Card
                title={promote?.employeeName}
                style={{ width: "300px" }}
                styles={{
                  header: { backgroundColor: "#30D3CB", color: "white" },
                  body: {
                    paddingTop: "0",
                    paddingBottom: "0",
                    display: "flex",
                    flexDirection: "column",
                  },
                }}
                hoverable
              >
                {/* <Tag style={{width:"70px", marginTop:"10px"}} color="gold">Promoted</Tag> */}
                <p>
                  <b>{t("newPosition")}:</b> {promote?.newPosition}
                </p>
                <p>
                  <b>{t("dateOfPromotion")}:</b>{" "}
                  {formatDate(promote?.dateOfPromotion)}
                </p>
                <p>
                  <b>{t("salary")}:</b> {promote?.newSalary}
                </p>
                <p>
                  <b>{t("trainedBy")}:</b> {promote?.trainedBy}
                </p>
                <Button
                  type="primary"
                  onClick={handleClick}
                  style={{ marginBottom: "10px" }}
                >
                  {t("viewOldPosition")}
                </Button>
              </Card>
            </div>
          </ReactCardFlip>
        </div>
      </ConfigProvider>
    </div>
  );
};

export default PromoteCard;

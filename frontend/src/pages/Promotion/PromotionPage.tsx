import { Typography, Input, Flex } from "antd";
import useHttp from "../../hooks/useHttp";
import PromoteCard from "./components/PromoteCard";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import Loader from "../../components/Shared/Loader";
import { PromoteType } from "./types/PromoteType";
import { useNavigate } from "react-router-dom";
import { isEmployee } from "../../utils/utils";

const { Search } = Input;

const PromotionPage: React.FC = () => {
  const { t } = useTranslation();
  const [isLoading, error, sendRequest] = useHttp();
  const [tableData, setTableData] = useState<PromoteType[]>([]);
  const [searchValue, setSearchValue] = useState<string>("");
  const navigate = useNavigate();
  const isEmp = isEmployee();

  useEffect(() => {
    if (isEmp) {
      navigate("/error");
    }
  }, [isEmp]);

  useEffect(() => {
    sendRequest(
      {
        endpoint: `promotions/promotion-history`,
        headers: {
          "Content-Type": "application/json",
        },
      },
      (response) => {
        setTableData(response);
      }
    );
  }, []);

  const handleSearch = (value: string) => {
    setSearchValue(value);
  };

  const filteredData = tableData.filter((promote) =>
    promote?.employeeName?.toLowerCase().includes(searchValue.toLowerCase())
  );

  if (isLoading) {
    return <Loader />;
  }
  if (error) {
    return <div>Something went wrong!!</div>;
  }

  return (
    <div>
      <Typography.Title level={3}>{t("promotions")}</Typography.Title>
      <p style={{ fontWeight: "lighter" }}>
        {t("viewPromotionRecordsForEmployees")}
      </p>
      <div>
        <Search
          placeholder={t("enterEmployeeName")}
          style={{ width: "100%", marginBottom: "20px", color: "red" }}
          styles={{ affixWrapper: { backgroundColor: "#e6f4ff" } }}
          onSearch={handleSearch}
          value={searchValue}
          onChange={(e) => setSearchValue(e.target.value)}
          enterButton
          allowClear
          size="large"
        />
      </div>
      <Flex wrap="wrap" justify="center">
        {filteredData.map((promote) => (
          <PromoteCard key={promote._id} promote={promote} />
        ))}
      </Flex>
    </div>
  );
};

export default PromotionPage;

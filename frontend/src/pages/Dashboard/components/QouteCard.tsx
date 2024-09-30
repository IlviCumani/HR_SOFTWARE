import { Card, Flex } from "antd";
import { useEffect, useState } from "react";
import Qoute from "../../../assets/qoute.png";
import { useTranslation } from "react-i18next";
import "../styles/QouteCard.css";

const QouteCard: React.FC = () => {
  const [quote, setQuote] = useState<string>("");
  const [author, setAuthor] = useState<string>("");
  const { t } = useTranslation();

  useEffect(() => {
    const fetchQuote = async () => {
      try {
        const response = await fetch("/api/today");
        const data = await response.json();

        if (data && data.length > 0) {
          setQuote(data[0].q);
          setAuthor(data[0].a);
        }
      } catch (error) {
        console.error("Error fetching the quote:", error);
      }
    };
    fetchQuote();
  }, []);

  return (
    <div>
      <Card className="card-quote" styles={{ body: { height: "auto" } }}>
        <Flex className="card-qoute-flex">
          <div>
            <h2>{t("dailyQuote")}</h2>
            <p className="qoute-line">"{quote}"</p>
            <p className="author-line">- {author}</p>
          </div>
          <div>
            <img className="qoute-img" src={Qoute} />
          </div>
        </Flex>
      </Card>
    </div>
  );
};

export default QouteCard;

import { Card, Flex } from "antd";
import { useEffect, useState } from "react";
import Qoute from "../../../assets/qoute.png";
import { useTranslation } from "react-i18next";
import "../styles/QouteCard.css";

const QouteCard: React.FC = () => {
  const [joke, setJoke] = useState<string>("");
  const { t } = useTranslation();

  useEffect(() => {
    const fetchQuote = async () => {
      try {
        const response = await fetch("/api/joke");
        const data = await response.json();

        if (data && data.joke) {
          setJoke(data.joke);
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
            <h2>{t("dailyJoke")}</h2>
            <p className="qoute-line">"{joke}"</p>
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

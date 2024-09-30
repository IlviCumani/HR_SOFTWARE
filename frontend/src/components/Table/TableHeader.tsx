import { Flex, Typography } from "antd";
import { PlusCircleOutlined } from "@ant-design/icons";
import Button from "../Shared/Button";
import { ButtonSize, ButtonType } from "../../enums/Button";
import { useTranslation } from "react-i18next";

type TableHeaderProps = {
  title: string;
  onClick?: () => void;
  items?: any[];
  hideButton?: boolean;
  secondaryButton?: {
    text: string;
    onClick: () => void;
    icon?: React.ReactNode;
  };
};

const TableHeader = ({
  title,
  onClick,
  hideButton,
  secondaryButton,
}: TableHeaderProps) => {
  const { t } = useTranslation();

  return (
    <Flex
      justify="space-between"
      align="center"
      style={{
        marginTop: "1rem",
        marginBottom: "2rem",
      }}
    >
      <Typography.Title
        style={{
          margin: 0,
        }}
        level={2}
      >
        {title}
      </Typography.Title>
      <Flex style={{ marginLeft: "auto" }}>
        {!hideButton && (
          <>
            <Button
              icon={<PlusCircleOutlined />}
              size={ButtonSize.LARGE}
              type={ButtonType.PRIMARY}
              onClick={onClick}
              // style={{ marginRight: "1rem" }}
            >
              {t("AddNew")}
            </Button>
            {secondaryButton && (
              <Button
                icon={secondaryButton.icon}
                size={ButtonSize.LARGE}
                type={ButtonType.PRIMARY}
                onClick={secondaryButton.onClick}
                style={{ marginLeft: "1rem", paddingInline: "2rem" }}
              >
                {secondaryButton.text}
              </Button>
            )}
          </>
        )}
      </Flex>
    </Flex>
  );
};

export default TableHeader;

import { Button as BTN, ConfigProvider } from "antd";
import type { CustomButtonProps } from "../../types/ButtonProps";

const Button = ({ children, ...props }: CustomButtonProps) => {
  return (
    <ConfigProvider
      theme={{
        components: {
          Button: {
            colorPrimary: `linear-gradient(135deg, #30D3CB, #2A9BE6, #2A9BE6)`,
            colorPrimaryHover: `linear-gradient(135deg, #2A9BE6, #30D3CB, #2A9BE6 )`,
            colorPrimaryActive: "#f46efc",
          },
        },
      }}
    >
      <BTN {...props}>{children}</BTN>
    </ConfigProvider>
  );
};

export default Button;

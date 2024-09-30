import { Card } from "antd";
import ChangeLanguage from "./components/ChangeLanguage";
import ChangePasswordForm from "./components/ChangePasswordForm";
import { PasswordProvider } from "./context";
import { PhoneOutlined } from "@ant-design/icons";
import { MdOutlineEmail } from "react-icons/md";
import "./styles/SettingsPage.css";

const SettingsPage: React.FC = () => {
  return (
    <div className="settings-main-div">
      <PasswordProvider children={<ChangePasswordForm />} />
      <ChangeLanguage />
      <Card className="contact-card">
        <div className="body-contact-card">
          <PhoneOutlined className="icon-contact" />
          <div className="inside-contact-card">
            <p>Telephone : +1 224-788-0689</p>
            <p>Mobile : +355 695877742</p>
          </div>
          <MdOutlineEmail className="icon-contact" />
          <div className="inside-contact-card">
            <p>Main Email: info@codevider.com</p>
            <p>hr@codevider.com</p>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default SettingsPage;

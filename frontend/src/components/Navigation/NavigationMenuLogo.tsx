import CodeviderLogo from "../../assets/codevider_logo-removebg-preview 1.svg";
import "../../styles/Navigation/NavigationMenuLogo.css";

interface logoProps {
  logotext: string;
}

const NavigationMenuLogo = ({ logotext }: logoProps) => {
  return (
    <div className="navigation-menu-logo">
      <img className="navigation-menu-logo-image" src={CodeviderLogo} alt="" />
      <h1 className="navigation-menu-logo-text">{logotext}</h1>
    </div>
  );
};

export default NavigationMenuLogo;

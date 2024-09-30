import { NavLink } from "react-router-dom";
import "../../styles/Shared/NavigationLink.css";
import { NavigationLinkProps } from "../../types/NavigationLinkProps";
import { useTranslation } from "react-i18next";

const NavigationLink = ({
  text,
  icon,
  linkTo,
  whiteText,
  handleClick,
}: NavigationLinkProps) => {
  const { t } = useTranslation();

  if (!linkTo) {
    return <div>{icon}</div>;
  }

  return (
    <div>
      <NavLink to={`${linkTo}`} onClick={handleClick}>
        {icon && icon}
        {text && (
          <span
            className={`navlink-text ${
              whiteText ? "white-navlink-text" : "color-navlink-text"
            }`}
          >
            {t(text)}
          </span>
        )}
      </NavLink>
    </div>
  );
};

export default NavigationLink;

import React from "react";
import { Tag, Popover, Avatar } from "antd";
import { EmployeeDetails } from "../../types/EmployeeDetailsProps";
import { capitalizeFirstLetter } from "../../utils/generals";

interface EmployeeTagProps {
  label: React.ReactNode;
  value: EmployeeDetails;
  closable: boolean;
  onClose?: (event?: React.MouseEvent<HTMLElement, MouseEvent>) => void;
  disabled: boolean;
  isMaxTag: boolean;
}

const getRandomColor = (initials: string) => {
  const hue =
    Array.from(initials).reduce((acc, char) => acc + char.charCodeAt(0), 0) %
    360;

  const saturation = Math.floor(Math.random() * 40) + 50;
  const lightness = Math.floor(Math.random() * 40) + 30;

  return `hsl(${hue}, ${saturation}%, ${lightness}%)`;
};

const EmployeeTag: React.FC<EmployeeTagProps> = ({
  label,
  value,
  closable,
  onClose,
}) => {
  if (!value) {
    return null;
  }

  const { name, surname, email, position, image } = value;

  const initials = `${name.charAt(0)}${surname.charAt(0)}`.toUpperCase();
  const avatarColor = image ? undefined : getRandomColor(initials);

  const popoverContent = (
    <div style={{ display: "flex", alignItems: "center", maxWidth: "300px" }}>
      {image ? (
        <Avatar src={image} size={64} style={{ marginRight: "10px" }} />
      ) : (
        <Avatar
          size={64}
          style={{ marginRight: "10px", backgroundColor: avatarColor }}
        >
          {initials}
        </Avatar>
      )}
      <div>
        <p>
          <strong>Name:</strong>{" "}
          {capitalizeFirstLetter(name) + " " + capitalizeFirstLetter(surname)}
        </p>
        {email && (
          <p>
            <strong>Email:</strong> {email}
          </p>
        )}
        {position && (
          <p>
            <strong>Position:</strong> {position}
          </p>
        )}
      </div>
    </div>
  );

  return (
    <Popover content={popoverContent} title="Employee Details">
      <Tag
        style={{ cursor: "pointer", padding: "5px" }}
        closable={closable}
        onClose={onClose}
      >
        {label}
      </Tag>
    </Popover>
  );
};

export default EmployeeTag;

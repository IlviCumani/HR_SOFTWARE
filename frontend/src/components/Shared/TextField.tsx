import {
  Form,
  Input,
  DatePicker,
  AutoComplete,
  TimePicker,
  message,
} from "antd";
import Select from "./Select";

export type SizeType = "small" | "middle" | "large" | undefined;

type TextFieldProps = {
  label: string;
  name: string;
  size?: SizeType;
  isRequired?: boolean;
  placeholder?: string;
  rules?: any[];
  inputType?:
    | "password"
    | "email"
    | "date"
    | "select"
    | "textarea"
    | "time"
    | "autoComplete";
};

type rulesType = any[];

export default function TextField({
  label,
  rules,
  name,
  size = "large",
  isRequired = false,
  placeholder,
  inputType,
  ...props
}: TextFieldProps) {
  let InputComponent: any = Input;
  const rulesArray: rulesType = [
    {
      required: isRequired,
      message: `Please enter ${label}!`,
    },
  ];

  switch (inputType) {
    case "password":
      InputComponent = Input.Password;
      rulesArray.push(
        {
          min: 8,
          message: "Password must be at least 8 characters",
        },
        {
          pattern: /.*\d.*/,
          message: "Password must contain at least one number",
        },
      );
      break;
    case "email":
      rulesArray.push({ type: "email", message: "Enter a valid " + inputType });
      break;
    case "textarea":
      InputComponent = Input.TextArea;
      break;
    case "date":
      InputComponent = DatePicker;
      break;
    case "time":
      InputComponent = TimePicker;
      break;
    case "select":
      InputComponent = Select;
      break;
    case "autoComplete":
      InputComponent = AutoComplete;
      break;
    default:
      InputComponent = Input;
      break;
  }

  return (
    <Form.Item
      style={{ width: "100%" }}
      label={label}
      rules={rulesArray}
      name={name}
      {...props}
      validateDebounce={1000}
    >
      {
        <InputComponent
          style={{ width: "100%" }}
          size={size}
          placeholder={placeholder}
        />
      }
    </Form.Item>
  );
}

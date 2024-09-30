import { Select as S } from "antd";

type SelectProps = {
  options: {
    value: string;
    label: string;
  }[];
  placeholder?: string;
  onChange?: (value: string) => void;
  value?: string;
  disabled?: boolean;
  defaultValue?: string;
};

const Select = ({ options, ...props }: SelectProps) => {
  return (
    <S {...props} size="large" style={{ width: "100%" }}>
      {options.map((option) => (
        <S.Option key={option.value} value={option.value}>
          {option.label}
        </S.Option>
      ))}
    </S>
  );
};

export default Select;

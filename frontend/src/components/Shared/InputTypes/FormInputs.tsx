import Input from "./Input";
import DatePicker from "./DatePicker";
import FormSelect from "./FormSelect";
import TimePicker from "./TimePicker";
import AutoComplete from "./AutoComplete";
import Upload from "./Upload";

const FormInputs = {
  Input,
  Select: FormSelect,
  DatePicker,
  TimePicker,
  AutoComplete,
  Upload,
};

export default FormInputs;

FormInputs.Input = Input;
FormInputs.Select = FormSelect;
FormInputs.DatePicker = DatePicker;
FormInputs.TimePicker = TimePicker;
FormInputs.AutoComplete = AutoComplete;
FormInputs.Upload = Upload;

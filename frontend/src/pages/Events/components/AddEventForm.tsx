import { Form, Flex, Radio } from "antd";
import FormInputs from "../../../components/Shared/InputTypes/FormInputs";
import MapInput from "./Map/MapInput";
import {
  useRef,
  forwardRef,
  useImperativeHandle,
  useState,
  useEffect,
} from "react";
import useMap from "../hook/useMap";
import useUpload from "../../../hooks/useUpload";
import { t } from "i18next";

type AddEventFormProps = {
  onAdd: (event: any) => void;
  onUploadChange: (isUploading: boolean) => void;
};

const AddEventForm = forwardRef(
  ({ onAdd, onUploadChange }: AddEventFormProps, ref) => {
    const [form] = Form.useForm();
    const formRef = useRef<any>();
    const [isMultipleDays, setIsMultipleDays] = useState(false);
    // const [fileList, setFileList] = useState<any[]>([]);
    const { fileList, addNewFilesHandler, updateFilesUrlHandler, isUploading } =
      useUpload();

    const map = useMap();

    useImperativeHandle(ref, () => ({
      submit: () => {
        formRef.current.submit();
      },
    }));

    useEffect(() => {
      onUploadChange(isUploading);
    }, [isUploading]);

    function onFinish(values: any) {
      const images = fileList.map((file) => file.url);

      const valuesToSubmit = {
        ...values,
        eventDate: values.eventDate.format("YYYY-MM-DD"),
        eventEndDate: values.eventEndDate
          ? values.eventEndDate.format("YYYY-MM-DD")
          : values.eventDate.format("YYYY-MM-DD"),
        eventStartTime: values.eventStartTime.format("HH:mm"),
        eventEndTime: values.eventEndTime
          ? values.eventEndTime.format("HH:mm")
          : undefined,
        location: map.locationData,
        images: images,
      };

      onAdd(valuesToSubmit);
    }

    return (
      <Form
        onFinish={onFinish}
        layout="vertical"
        style={{ maxWidth: 600, margin: "40px auto" }}
        form={form}
        name="basic"
        ref={formRef}
        autoComplete="off"
      >
        <FormInputs.Input label={t("eventName")} name="eventName" required />

        <Flex
          align="center"
          justify="center"
          style={{
            marginTop: 10,
            marginBottom: 20,
            paddingBottom: 25,
            borderBottom: "1px solid #e0e0e0",
          }}
        >
          <Radio.Group
            onChange={(e) => {
              setIsMultipleDays(e.target.value === "multipleDays");
            }}
            buttonStyle="outline"
            optionType="button"
            defaultValue={"singleDay"}
          >
            <Radio value="singleDay">{t("singleDay")}</Radio>
            <Radio value="multipleDays">{t("multipleDays")}</Radio>
          </Radio.Group>
        </Flex>

        <Flex gap={10}>
          <FormInputs.DatePicker
            label={t("eventDate")}
            name="eventDate"
            required
            isDisabledDate
          />
          {isMultipleDays && (
            <FormInputs.DatePicker
              label={t("eventEndDate")}
              name="eventEndDate"
              isDisabledDate
              dependsOn="eventDate"
              required={isMultipleDays}
            />
          )}
        </Flex>

        <Flex gap={10}>
          <FormInputs.TimePicker
            label={t("eventStartTime")}
            name="eventStartTime"
            required
          />
          {!isMultipleDays && (
            <FormInputs.TimePicker
              label={t("eventEndTime")}
              name="eventEndTime"
              dependsOn={"eventStartTime"}
              required={!isMultipleDays}
            />
          )}
        </Flex>

        <MapInput map={map} />

        <FormInputs.Input
          label={t("eventDescription")}
          name="eventDescription"
          type="textarea"
        />
        <FormInputs.Upload
          fileList={fileList}
          addNewFilesHandler={addNewFilesHandler}
          updateFilesUrlHandler={updateFilesUrlHandler}
          name="images"
          label={t("eventAttachment")}
          required
        />
      </Form>
    );
  }
);

export default AddEventForm;

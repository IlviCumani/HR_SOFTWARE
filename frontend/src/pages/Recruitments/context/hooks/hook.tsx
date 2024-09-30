import { useState } from "react";
import { ApplicantProps } from "../../../../types/ApplicantProps";
import useHttp from "../../../../hooks/useHttp";
import { AxiosError } from "axios";
import { Form, message } from "antd";
import { RecruitmentStage } from "../../columns/constants";
import { Filters } from "./filter.hook";
import Axios from "../../../../helpers/axios";
import { getAuthToken, getFromLocalStorage } from "../../../../utils/utils";

const API = import.meta.env.REACT_APP_RECRUITMENT_API;
const main_api = import.meta.env.REACT_APP_MAIN;

export const useRecruitment = () => {
  const [tableData, setTableData] = useState<ApplicantProps[]>([]);
  const [editingRecord, setEditingRecord] = useState<ApplicantProps | null>(
    null
  );
  const [drawerState, setDrawerState] = useState<boolean>(false);
  const [isLoading, , sendRequest] = useHttp();
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [form] = Form.useForm();
  const [file, setFile] = useState<File | null>(null);

  const fetchApplicants = async (
    page: number,
    limit: number,
    filters: Filters
  ) => {
    try {
      const response = await Axios.get(API, {
        params: { page, limit, filters },
      });
      const { data, meta } = response.data;
      setTableData(data);
      return meta.itemCount;
    } catch (error) {
      if (error instanceof AxiosError)
        message.error(
          error.message || error.response?.data.errorDetails.message
        );
      message.error("Failed to retrieve applicant");
    }
  };

  const createApplicant = async (newData: ApplicantProps) => {
    try {
      console.log("submitedDate", newData.dateSubmitted);
      const updatedData = { ...newData, stage: RecruitmentStage.Applied };
      const res = await Axios.post(API, updatedData);
      handleAddNew(res.data);
      return res;
    } catch (error) {
      if (error instanceof AxiosError)
        message.error(
          error.response?.data.errorDetails.message || error.message
        );
      message.error("Failed to add applicant");
    }
  };

  const handleDelete = (id: string) => {
    sendRequest(useHttp.deleteRequestHelper(`${API}/${id}`));
    setTableData((prevData) =>
      prevData.filter((item: ApplicantProps) => item._id !== id)
    );
  };

  const handleAddNew = (newData: ApplicantProps) => {
    setTableData((prevData) => [newData, ...prevData]);
    setIsEditModalVisible(false);
    message.success(
      `${newData.name} ${newData.surname} added to the applicants successfully`
    );
  };

  const handleEdit = (newData: ApplicantProps) => {
    setTableData((prevData) =>
      prevData.map((item) => (item._id === newData._id ? newData : item))
    );
  };

  const handleEditButtonClick = (record: ApplicantProps) => {
    setEditingRecord(record);
    setIsEditModalVisible(true);
  };

  const handleOnClose = () => {
    setIsEditModalVisible(false);
    setEditingRecord(null);
  };
  const handleUpload = async (file: File) => {
    const formData = new FormData();
    formData.append("file", file);
    try {
      const uploadResponse = await fetch(`${main_api}/files/upload`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${getAuthToken()}`,
        },
        body: formData,
      });

      if (!uploadResponse.ok) {
        throw new Error("File upload failed");
      }

      const uploadData = await uploadResponse.json();
      const fileUrl = uploadData.fileUrl;

      form.setFieldsValue({ cv: fileUrl });
      setFile(null);
    } catch (error) {
      console.error("File upload error:", error);
    }
  };

  const updateApplicant = async (_id: string, values: any, step: number) => {
    let updatedValues = {};
    let stage: RecruitmentStage = RecruitmentStage.Applied;

    const { stage: currentStage } = editingRecord || {};

    switch (step) {
      case 0:
        updatedValues = { ...values };
        break;
      case 1:
        if (currentStage === RecruitmentStage.Applied) {
          stage = RecruitmentStage.FirstInterview;
        }
        updatedValues = {
          name: editingRecord?.name,
          surname: editingRecord?.surname,
          stage,
          firstInterview: {
            ...values,
            interviewers: values?.interviewers
              .map((emp: any) => emp._id)
              .filter((id: string): id is string => id !== undefined),
          },
        };
        break;
      case 2:
        if (currentStage !== RecruitmentStage.OfferMade) {
          stage = RecruitmentStage.SecondInterview;
        }
        updatedValues = {
          name: editingRecord?.name,
          surname: editingRecord?.surname,
          stage,
          secondInterview: {
            ...values,
            interviewers: values?.interviewers
              .map((emp: any) => emp._id)
              .filter((id: string): id is string => id !== undefined),
          },
        };
        break;
      case 3:
        stage = RecruitmentStage.OfferMade;
        updatedValues = {
          name: editingRecord?.name,
          surname: editingRecord?.surname,
          stage,
          offerMade: { ...values },
        };
        break;
      default:
        message.error("Invalid step");
        return;
    }
    try {
      const res = await Axios.patch(`${API}/${_id}`, {
        recruitment: updatedValues,
        creatorID: getFromLocalStorage().employID,
      });
      handleEdit(res.data);
      message.success("Applicant updated successfully!");
      return res;
    } catch (error) {
      if (error instanceof AxiosError) {
        if (error instanceof AxiosError) {
          const errorMessage =
            error.response?.data?.message?.[0] ||
            error.message ||
            "An error occurred.";
          message.error(errorMessage);
        }
      } else {
        message.error("An unexpected error occurred.");
      }
    }
  };

  const handleFileChange = async () => {
    if (file) {
      handleUpload(file);
    } else {
      message.error("No file chose");
    }
  };

  const handleGoogleAuth = async (
    email: string,
    startDate: Date,
    subject: string
  ) => {
    try {
      const res = await Axios.get(`/auth/check-refresh-token`, {
        params: {
          email: email,
          startDate: startDate,
          subject: subject,
        },
      });

      const { url, message: authMessage } = res.data;
      message.info(authMessage);
      return url;
    } catch (error) {
      if (error instanceof AxiosError) {
        message.error(
          error.response?.data.errorDetails.message || error.message
        );
      }
      return null;
    }
  };

  // const fetchMails = async (startDate: Date, subject: string) => {
  //   try {
  //     const res = await Axios.get("/gmails", {
  //       params: {
  //         startDate: startDate,
  //         subject: subject,
  //       },
  //     });
  //     message.success("Applicants were retrieved successfully");
  //     return res.data;
  //   } catch (error) {
  //     if (error instanceof AxiosError) {
  //       message.error(
  //         error.response?.data.errorDetails.message || error.message
  //       );
  //     }
  //     return null;
  //   }
  // };

  const handleModalOk = async (startDate: Date, subject: string) => {
    if (!startDate || !subject) {
      message.error("Please provide both a start date and a subject.");
      return;
    }

    try {
      const email = getFromLocalStorage().email;

      const authUrl = await handleGoogleAuth(email, startDate, subject);

      if (authUrl) {
        window.location.href = authUrl;
      }
    } catch (error) {
      message.error("Failed to fetch emails. Please try again.");
    } finally {
      // setIsModalVisible(false);
    }
  };

  return {
    createApplicant,
    form,
    tableData,
    editingRecord,
    drawerState,
    setDrawerState,
    isLoading,
    isEditModalVisible,
    handleDelete,
    handleAddNew,
    handleEdit,
    handleEditButtonClick,
    handleOnClose,
    setEditingRecord,
    fetchApplicants,
    handleFileChange,
    setFile,
    handleUpload,
    updateApplicant,
    setTableData,
    handleModalOk,
  };
};

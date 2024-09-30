import { Rule } from "antd/es/form";

export const usePasswordValidation = (form: any) => {
  const validateConfirmPassword = (
    _rule: Rule,
    value: any,
    callback: (error?: string) => void,
  ) => {
    const newPassword = form.getFieldValue("newPassword");
    if (!value || newPassword === value) {
      callback();
    } else {
      callback("Confirm password should match the new password!");
    }
  };

  const validateNewPasswordNotOldPassword = (
    _rule: Rule,
    value: any,
    callback: (error?: string) => void,
  ) => {
    const oldPassword = form.getFieldValue("oldPassword");
    if (value && value !== oldPassword) {
      callback();
    } else {
      callback("The new password must be different from the old password!");
    }
  };

  return {
    validateConfirmPassword,
    validateNewPasswordNotOldPassword,
  };
};

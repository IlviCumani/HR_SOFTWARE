import React from "react";
import Button from "./Button";
import { ButtonType } from "../../enums/Button";
import { t } from "i18next";
import { Modal as AntModal, Flex, Tooltip } from "antd";
import { InfoCircleOutlined } from "@ant-design/icons";

type ModalProps = {
  children: React.ReactNode;
  onOk?: () => void | undefined;
  isLoading?: boolean;
  onCancel?: () => void | undefined;
  isOpen: true | false;
  title?: string;
  width?: number;
  okBtnText?: string;
  okBtnTextSubmitting?: string;
  infoTooltipText?: string;
};

const Modal = ({
  children,
  onOk,
  onCancel,
  isOpen,
  title,
  isLoading,
  width,
  okBtnText = t("submit"),
  okBtnTextSubmitting = t("submitting"),
  infoTooltipText,
}: ModalProps) => {
  return (
    <AntModal
      title={
        <Flex align="center">
          {infoTooltipText && (
            <Tooltip title={infoTooltipText}>
              <Button
                type={ButtonType.TEXT}
                icon={<InfoCircleOutlined />}
                style={{ marginLeft: 8, color: "yellow" }}
                shape="circle"
              />
            </Tooltip>
          )}
          {title}
        </Flex>
      }
      destroyOnClose
      open={isOpen}
      onCancel={onCancel}
      onOk={onOk}
      footer={null}
      width={width}
      style={{ top: 20 }}
    >
      {children}
      <Flex justify="flex-end" gap={15}>
        {onCancel && (
          <Button type={ButtonType.TEXT} danger onClick={onCancel}>
            {t("cancel")}
          </Button>
        )}
        {onOk && (
          <Button type={ButtonType.PRIMARY} onClick={onOk} disabled={isLoading}>
            {isLoading ? okBtnTextSubmitting : okBtnText}
          </Button>
        )}
      </Flex>
    </AntModal>
  );
};

export default Modal;

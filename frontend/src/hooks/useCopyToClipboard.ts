import { useState } from "react";

const useCopyToClipboard = () => {
  const [isCopied, setIsCopied] = useState(false);
  const [copyError, setCopyError] = useState<string | null>(null);

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setIsCopied(true);
      setCopyError(null);
    } catch (err) {
      setIsCopied(false);
      setCopyError("Failed to copy text");
      console.error("Copy failed: ", err);
    } finally {
      setTimeout(() => setIsCopied(false), 2000);
    }
  };

  return { copyToClipboard, isCopied, copyError };
};

export default useCopyToClipboard;

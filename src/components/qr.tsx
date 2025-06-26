import { useState, useEffect, useRef } from "react";

export default function QRGenerator({ content }: { content: string }) {
  const [qrUrl, setQrUrl] = useState<string>("");
  const imgRef = useRef<HTMLImageElement>(null);

  const generateQR = async (content: string) => {
    const qrModule = await import("../third-party/qr.min.js");
    const qr = qrModule.default || qrModule;

    const gifBytes = qr.encodeQR(content, "gif", {
      ecc: "low",
      version: 2,
      mask: 7,
      scale: 11,
    });

    const blob = new Blob([gifBytes], { type: "image/gif" });
    const url = URL.createObjectURL(blob);
    if (qrUrl) {
      URL.revokeObjectURL(qrUrl);
    }

    setQrUrl(url);
    return <img src={qrUrl} />;
  };

  // Generate QR on mount and when token changes
  useEffect(() => {
    if (content) {
      generateQR(content);
    }

    // Cleanup function
    return () => {
      if (qrUrl) {
        URL.revokeObjectURL(qrUrl);
      }
    };
  }, [content]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (qrUrl) {
        URL.revokeObjectURL(qrUrl);
      }
    };
  }, [qrUrl]);

  return qrUrl.length ? (
    <img
      ref={imgRef}
      src={qrUrl}
      alt="QR Code"
      style={{ maxWidth: "100%", height: "auto" }}
    />
  ) : (
    <></>
  );
}

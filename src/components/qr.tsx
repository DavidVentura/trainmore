import { useState, useEffect, useRef } from "react";

export default function QRGenerator({ token }: { token: string }) {
  const [qrUrl, setQrUrl] = useState<string>("");
  const imgRef = useRef<HTMLImageElement>(null);

  const generateQR = async (tokenValue: string) => {
    console.log("generate", tokenValue);
    const qrModule = await import("../third-party/qr.min.js");
    const qr = qrModule.default || qrModule;

    const gifBytes = qr.encodeQR(tokenValue, "gif", {
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
    console.log("token", token);
    if (token) {
      generateQR(token);
    }

    // Cleanup function
    return () => {
      if (qrUrl) {
        URL.revokeObjectURL(qrUrl);
      }
    };
  }, [token]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (qrUrl) {
        URL.revokeObjectURL(qrUrl);
      }
    };
  }, [qrUrl]);

  return (
    <div className="qr-generator">
      <h2>QR Code</h2>
      {qrUrl && (
        <img
          ref={imgRef}
          src={qrUrl}
          alt="QR Code"
          style={{ maxWidth: "100%", height: "auto" }}
        />
      )}
      <button onClick={() => generateQR(token)}>Regenerate QR</button>
    </div>
  );
}

import { useState, useEffect, useRef, useCallback } from "react";
import qr from "../third-party/qr.min.js";

interface Props {
  content: string;
  className?: string;
  size?: number;
  alt?: string;
}

interface QRState {
  url: string | null;
  isLoading: boolean;
  error: string | null;
}

const QRGenerator = ({
  content,
  className = "",
  size = 300,
  alt = "QR Code",
}: Props) => {
  const [state, setState] = useState<QRState>({
    url: null,
    isLoading: false,
    error: null,
  });
  const imgRef = useRef<HTMLImageElement>(null);

  const generateQR = useCallback((content: string) => {
    if (!content.trim()) {
      setState((prev) => ({
        ...prev,
        error: "No content provided",
        isLoading: false,
      }));
      return;
    }

    setState((prev) => ({ ...prev, isLoading: true, error: null }));

    try {
      const gifBytes = qr.encodeQR(content, "gif", {
        ecc: "low",
        version: 2,
        mask: 7,
        scale: 11,
      });

      const blob = new Blob([gifBytes], { type: "image/gif" });
      const url = URL.createObjectURL(blob);

      setState((prev) => ({
        url,
        isLoading: false,
        error: null,
      }));
    } catch (error) {
      console.error("Failed to generate QR code:", error);
      setState((prev) => ({
        ...prev,
        isLoading: false,
        error: "Failed to generate QR code",
      }));
    }
  }, []);

  useEffect(() => {
    if (content) {
      generateQR(content);
    }
  }, [content, generateQR]);

  useEffect(() => {
    return () => {
      if (state.url) {
        URL.revokeObjectURL(state.url);
      }
    };
  }, [state.url]);

  if (state.isLoading) {
    return (
      <div
        className={`qr-loading ${className}`}
        style={{
          width: size,
          height: size,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          border: "1px solid #e0e0e0",
          borderRadius: "8px",
        }}
        aria-label="Generating QR code..."
      >
        <span>Generating QR code...</span>
      </div>
    );
  }

  if (state.error) {
    return (
      <div
        className={`qr-error ${className}`}
        style={{
          width: size,
          height: size,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          border: "1px solid #ff6b6b",
          borderRadius: "8px",
          backgroundColor: "#fff5f5",
          color: "#e53e3e",
        }}
        role="alert"
        aria-live="polite"
      >
        <span>{state.error}</span>
      </div>
    );
  }

  if (!state.url) {
    return null;
  }

  return (
    <img
      ref={imgRef}
      src={state.url}
      alt={alt}
      className={`qr-code ${className}`}
      style={{
        maxWidth: "100%",
        height: "auto",
        width: size,
        borderRadius: "8px",
      }}
      onError={() => {
        setState((prev) => ({
          ...prev,
          error: "Failed to load QR code image",
        }));
      }}
    />
  );
};

export default QRGenerator;

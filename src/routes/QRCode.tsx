import { useEffect } from "react";
import { Navigate, useNavigate } from "react-router";
import { useQR } from "../hooks/useQR";
import QRGenerator from "../components/qr";
import { ApiError } from "../utils/api";
import { useLogout } from "../hooks/useLogout";

export default function QRCode() {
  const navigate = useNavigate();
  const token = localStorage.getItem("access_token")!;
  const logout = useLogout();

  const { data, error, refetch } = useQR(
    { access_token: token },
    { enabled: !!token }
  );

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (data) {
      const date = new Date(data.expiry_date);
      const now = new Date();
      const ttl = date.getTime() - now.getTime();
      console.log(`ttl ${ttl}`);

      if (ttl <= 10) {
        console.log("refetching because it was in the past");
        void refetch();
        return;
      }

      console.log("setting the timer");
      timer = setTimeout(async () => {
        console.log("refetching");
        await refetch();
      }, ttl);
    }

    return () => {
      if (timer) {
        console.log("remove");
        clearTimeout(timer);
      }
    };
  }, [data, refetch]);

  if (error) {
    if (error instanceof ApiError && error.status === 401) {
      logout();
    }
    console.log("failed to qr", error);
    return (
      <div className="qr-error">
        <p>Failed to load QR code. Please try again.</p>
        <button onClick={() => refetch()}>Retry</button>
      </div>
    );
  }

  return (
    <div className="qr-content">
      <h2>QR Code</h2>
      {data && <QRGenerator content={data.content} />}
      <div className="qr-actions">
        <button onClick={() => navigate("/visits")}>View Visits</button>
        <button onClick={() => refetch()}>Regenerate QR</button>
      </div>
    </div>
  );
}

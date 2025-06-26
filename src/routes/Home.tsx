import QRGenerator from "../components/qr";
import { redirect, useNavigate } from "react-router";
import { useQR } from "../hooks/useQR";
import { useEffect, useState } from "react";

export default function Home() {
  const navigate = useNavigate();
  const token = localStorage.getItem("access_token")!;

  const { data, error, refetch } = useQR(
    { access_token: token },
    { enabled: true }
  );
  if (error != null) {
    console.log("failed to qr");
    redirect("/login");
  }

  console.log(data);
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
  }, [data]);

  return (
    <>
      <div className="qr-generator">
        <h2>QR Code</h2>
        {data && <QRGenerator content={data.content} />}
      </div>
      <button onClick={() => navigate("/visits")}>visits</button>
      <button onClick={() => refetch()}>regen qr</button>
    </>
  );
}

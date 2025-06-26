import QRGenerator from "../components/qr";
import { useNavigate } from "react-router";

export default function Home() {
  const navigate = useNavigate();

  return (
    <>
      <QRGenerator token="klasjdlaks" />
      <button onClick={() => navigate("/visits")}>visits</button>
    </>
  );
}

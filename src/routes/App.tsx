import { RouterProvider, createBrowserRouter, Outlet } from "react-router";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import ThemeProvider from "../components/ThemeProvider";
import Login from "./Login";
import Home from "./Home";
import Visits from "./Visits";
import RequireAuth from "../auth/RequireAuth";
import "@radix-ui/themes/styles.css";
import "../styles/global.css";
import { Container } from "@radix-ui/themes";
import QRCode from "./QRCode";

const queryClient = new QueryClient();

const router = createBrowserRouter([
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/",
    element: (
      <RequireAuth>
        <Outlet />
      </RequireAuth>
    ),
    children: [
      {
        index: true,
        element: <Home />,
      },
      {
        path: "qr-code",
        element: <QRCode />,
      },
      {
        path: "visits",
        element: <Visits />,
      },
      {
        path: "workout",
        element: <div>Workout</div>,
      },
    ],
  },
]);

export default function App() {
  return (
    <ThemeProvider>
      <QueryClientProvider client={queryClient}>
        <Container size="3" px="2">
          <RouterProvider router={router} />
        </Container>
      </QueryClientProvider>
    </ThemeProvider>
  );
}

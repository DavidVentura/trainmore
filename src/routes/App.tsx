import { RouterProvider, createBrowserRouter, Outlet } from "react-router";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import ThemeProvider from "../components/ThemeProvider";
import Login from "./Login";
import Home from "./Home";
import Visits from "./Visits";
import RequireAuth from "../auth/RequireAuth";
import "@radix-ui/themes/styles.css";
import "../styles/global.css";
import { Container, Text } from "@radix-ui/themes";
import QRCode from "./QRCode";
import { Toaster } from "../components/common/Toast";
import { Layout } from "../components/common/Layout";
import { Footer } from "../components/common/Footer";

const queryClient = new QueryClient();

const router = createBrowserRouter([
  {
    path: "/login",
    element: (
      <Container size="3" px="2">
        <Login />
      </Container>
    ),
  },
  {
    path: "/",
    element: (
      <RequireAuth>
        <Layout.Root>
          <Layout.Main>
            <Outlet />
          </Layout.Main>
          <Layout.Footer>
            <Footer />
          </Layout.Footer>
        </Layout.Root>
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
        <RouterProvider router={router} />
        <Toaster />
      </QueryClientProvider>
    </ThemeProvider>
  );
}


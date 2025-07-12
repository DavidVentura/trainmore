import { Toaster as SonnerToaster } from "sonner";
import "./styles.css";
import { CircleAlert, CircleCheck, CircleX, Info } from "lucide-react";

export const Toaster = () => {
  return (
    <SonnerToaster
      richColors
      theme="dark"
      expand
      visibleToasts={5}
      toastOptions={{
        classNames: {
          toast: "toast",
        },
      }}
      icons={{
        success: <CircleCheck strokeWidth={1.5} size={18} />,
        info: <Info strokeWidth={1.5} size={18} />,
        warning: <CircleAlert strokeWidth={1.5} size={18} />,
        error: <CircleX strokeWidth={1.5} size={18} />,
      }}
    />
  );
};

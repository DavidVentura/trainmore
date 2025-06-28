import React from "react";
import { Theme } from "@radix-ui/themes";

interface ThemeProviderProps {
  children: React.ReactNode;
}

export default function ThemeProvider({ children }: ThemeProviderProps) {
  return (
    <Theme
      appearance="dark"
      accentColor="lime"
      grayColor="slate"
      radius="full"
      scaling="90%"
      panelBackground="translucent"
    >
      {children}
    </Theme>
  );
}

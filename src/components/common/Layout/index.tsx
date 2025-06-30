import { Box, Container, Grid, ScrollArea } from "@radix-ui/themes";

interface LayoutRootProps {
  children: React.ReactNode;
}
const LayoutRoot = ({ children }: LayoutRootProps) => {
  return (
    <Grid
      rows="auto 1fr 78px"
      gap="0"
      style={{
        height: "100vh",
        minHeight: "100vh",
        gridTemplateAreas: `
          "header"
          "main"
          "footer"
        `,
      }}
    >
      {children}
    </Grid>
  );
};

interface LayoutHeaderProps {
  children?: React.ReactNode;
}
const LayoutHeader = ({ children }: LayoutHeaderProps) => {
  return (
    <div
      style={{
        gridArea: "header",
        height: "160px",
        minHeight: "160px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "var(--gray-1)",
      }}
    >
      {children}
    </div>
  );
};

interface LayoutMainProps {
  children: React.ReactNode;
}
const LayoutMain = ({ children }: LayoutMainProps) => {
  return (
    <ScrollArea
      type="auto"
      scrollbars="vertical"
      style={{
        gridArea: "main",
      }}
    >
      <Container size="3" px="2" py="4">
        {children}
      </Container>
    </ScrollArea>
  );
};

interface LayoutFooterProps {
  children?: React.ReactNode;
}
const LayoutFooter = ({ children }: LayoutFooterProps) => {
  return (
    <Box
      height="78px"
      minHeight="78px"
      style={{
        gridArea: "footer",
        backgroundColor: `var(--color-panel-translucent)`,
      }}
    >
      {children}
    </Box>
  );
};

export const Layout = Object.assign(LayoutRoot, {
  Root: LayoutRoot,
  Header: LayoutHeader,
  Main: LayoutMain,
  Footer: LayoutFooter,
});

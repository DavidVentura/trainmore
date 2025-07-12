import { Box, Container, Grid, ScrollArea } from "@radix-ui/themes";
import "./styles.css";

interface LayoutRootProps {
  children: React.ReactNode;
}
const LayoutRoot = ({ children }: LayoutRootProps) => {
  return (
    <Grid rows="auto 1fr 78px" gap="0" className="layout-root">
      {children}
    </Grid>
  );
};

interface LayoutHeaderProps {
  children?: React.ReactNode;
}
const LayoutHeader = ({ children }: LayoutHeaderProps) => {
  return <div className="layout-header">{children}</div>;
};

interface LayoutMainProps {
  children: React.ReactNode;
}
const LayoutMain = ({ children }: LayoutMainProps) => {
  return (
    <ScrollArea type="auto" scrollbars="vertical" className="layout-main">
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
  return <Box className="layout-footer">{children}</Box>;
};

export const Layout = Object.assign(LayoutRoot, {
  Root: LayoutRoot,
  Header: LayoutHeader,
  Main: LayoutMain,
  Footer: LayoutFooter,
});

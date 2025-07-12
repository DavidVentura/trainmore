import { Box, Button, Card, Flex, Grid, Heading, Text } from "@radix-ui/themes";
import QRCode from "./QRCode";
import { Link } from "react-router";
import { CalendarDays, Dumbbell, QrCode as QrCodeIcon } from "lucide-react";

export default function Home() {
  return (
    <Flex direction="column" gap="4">
      <Card size="3">
        <Flex direction="column" gap="5">
          <Heading as="h2">Quick Access</Heading>
          <Grid columns="2" gap="4">
            <Box gridColumn="span 2">
              <Card
                asChild
                variant="surface"
                size="3"
                className="animated-gradient-card"
              >
                <Link to="/qr-code">
                  <Flex align="center" gap="2">
                    <QrCodeIcon strokeWidth={2} />
                    <Text weight="bold">Entry QR Code</Text>
                  </Flex>
                </Link>
              </Card>
            </Box>

            <Card asChild variant="surface" size="3">
              <Link to="/visits">
                <Flex align="center" gap="2">
                  <CalendarDays />
                  <Text weight="bold">Visits</Text>
                </Flex>
              </Link>
            </Card>

            <Card asChild variant="surface" size="3">
              <Link to="/workout">
                <Flex align="center" gap="2">
                  <Dumbbell />
                  <Text weight="bold">Workout</Text>
                </Flex>
              </Link>
            </Card>
          </Grid>
        </Flex>
      </Card>
    </Flex>
  );
}

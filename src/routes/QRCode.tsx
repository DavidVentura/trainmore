import { useEffect, useState } from "react";
import { useQR } from "../hooks/useQR";
import QRGenerator from "../components/qr";
import { ApiError } from "../utils/api";
import { useLogout } from "../hooks/useLogout";
import {
  Badge,
  Box,
  Button,
  Card,
  Container,
  Flex,
  Heading,
  Text,
} from "@radix-ui/themes";
import { Ban } from "lucide-react";

export default function QRCode() {
  const token = localStorage.getItem("access_token")!;
  const logout = useLogout();
  const [timeRemaining, setTimeRemaining] = useState<string>("");

  const { data, error, refetch } = useQR(
    { access_token: token },
    { enabled: !!token }
  );

  useEffect(() => {
    if (!data || error) return;

    const updateTimeRemaining = () => {
      const expiryDate = new Date(data.expiry_date);
      const now = new Date();
      const diff = expiryDate.getTime() - now.getTime();

      if (diff <= 0) {
        setTimeRemaining("Expired");
        void refetch();
        return;
      }

      const minutes = Math.floor(diff / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);
      setTimeRemaining(`${minutes}:${seconds.toString().padStart(2, "0")}`);
    };
    updateTimeRemaining();

    const interval = setInterval(updateTimeRemaining, 1000);
    return () => clearInterval(interval);
  }, [data, refetch]);

  if (error && error instanceof ApiError && error.status === 401) {
    logout();
  }

  return (
    <Card size="3">
      <Flex direction="column" gap="4" align="stretch">
        <Flex justify="between" align="center">
          <Heading as="h3">Entry QR Code</Heading>
          {timeRemaining && (
            <Badge color="gray" size="3">
              {timeRemaining}
            </Badge>
          )}
        </Flex>
        <Container align="center">
          {error ? (
            <Card variant="surface">
              <Flex
                direction="column"
                align="center"
                justify="center"
                height="300px"
              >
                <Flex
                  height="48px"
                  width="48px"
                  align="center"
                  justify="center"
                >
                  <Text asChild color="red">
                    <Ban />
                  </Text>
                </Flex>
                <Text as="p" align="center" color="red">
                  Failed to load QR code. Please try again.
                </Text>
              </Flex>
            </Card>
          ) : (
            data && (
              <Box mx="auto" width="fit-content">
                <QRGenerator content={data.content} size={300} />
              </Box>
            )
          )}
        </Container>

        <Button onClick={() => refetch()} size="3">
          Regenerate QR
        </Button>
      </Flex>
    </Card>
  );
}

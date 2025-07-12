import { Card, Flex, Heading, Table, Text } from "@radix-ui/themes";
import { useGymVisits } from "../hooks/useVisits";
import type { GymVisit } from "../utils/api";
import { Navigate } from "react-router";
import { format } from "date-fns";
import { Calendar, ClockArrowDown, ClockArrowUp, Timer } from "lucide-react";

const elapsedDays = (d: Date): number => {
  return (Date.now() - d.getTime()) / 86_400_000;
};

const prettyDuration = (min: number): string => {
  if (min < 60) {
    return `${min} minutes`;
  }
  return `${Math.floor(min / 60)}h ${min % 60}m`;
};

const workoutDurationSince = (
  visits: GymVisit[],
  daysSince: number
): number => {
  return visits
    .filter((item) => elapsedDays(item.checkin_time) < daysSince)
    .reduce((acc, cur) => {
      return acc + cur.duration_minutes;
    }, 0);
};

export default function Visits() {
  const token = localStorage.getItem("access_token")!;
  const { data, error } = useGymVisits({ access_token: token });

  if (error) {
    // TODO 401 vs other
    return <Navigate to="/login" />;
  }
  if (!data) {
    return <>no data</>;
  }

  console.log(data);

  const firstVisit = data.at(0);

  return (
    <Card size="3">
      <Heading as="h3">Visits</Heading>
      <Table.Root>
        <Table.Header>
          <Table.Row>
            <Table.ColumnHeaderCell>
              <Flex align="center" gap="1">
                <Calendar
                  size={14}
                  strokeWidth={1.5}
                  color={`var(--gray-11)`}
                />

                <Text>Date</Text>
              </Flex>
            </Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell>
              <Flex align="center" gap="1">
                <ClockArrowDown
                  size={14}
                  strokeWidth={1.5}
                  color={`var(--gray-11)`}
                />
                <Text>Check-in</Text>
              </Flex>
            </Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell>
              <Flex align="center" gap="1">
                <ClockArrowUp
                  size={14}
                  strokeWidth={1.5}
                  color={`var(--gray-11)`}
                />
                <Text>Check-out</Text>
              </Flex>
            </Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell>
              <Flex align="center" gap="1">
                <Timer size={14} strokeWidth={1.5} color={`var(--gray-11)`} />
                <Text>Duration</Text>
              </Flex>
            </Table.ColumnHeaderCell>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {data.toReversed().map((x, i) => (
            <Table.Row key={i}>
              <Table.Cell>{format(x.checkin_time, "ccc, dd/MM")}</Table.Cell>
              <Table.Cell>
                {format(x.checkin_time, "HH:mm")}{" "}
                <Text color="gray" size="1" weight="light">
                  HS
                </Text>
              </Table.Cell>
              <Table.Cell>
                {x.is_averaged && "~"}
                {format(x.checkout_time, "HH:mm")}{" "}
                <Text color="gray" size="1" weight="light">
                  HS
                </Text>
              </Table.Cell>
              <Table.Cell>
                {x.duration_minutes}
                <Text color="gray" size="1" weight="light">
                  {`'`}
                </Text>
                {x.is_averaged && "*"}
              </Table.Cell>
            </Table.Row>
          ))}
        </Table.Body>
      </Table.Root>
      <p>Time last 07d: {prettyDuration(workoutDurationSince(data, 7))}</p>
      <p>Time last 30d: {prettyDuration(workoutDurationSince(data, 30))}</p>
      {firstVisit && elapsedDays(firstVisit.checkin_time) > 30 && (
        <p>
          Total time
          {prettyDuration(workoutDurationSince(data, Number.MAX_SAFE_INTEGER))}
        </p>
      )}
    </Card>
  );
}

import { Card, Flex, Grid, Table, Text, Tooltip } from "@radix-ui/themes";
import { useGymVisits } from "../hooks/useVisits";
import type { GymVisit } from "../utils/api";
import { Navigate } from "react-router";
import {
  addDays,
  endOfMonth,
  endOfWeek,
  format,
  isAfter,
  isBefore,
  isSameDay,
  isToday,
  startOfMonth,
  startOfWeek,
} from "date-fns";
import {
  Asterisk,
  Calendar,
  CalendarCheck,
  ChartBar,
  ClockArrowDown,
  ClockArrowUp,
  TicketsPlane,
  Timer,
} from "lucide-react";
import { Heading } from "../components/common/Heading";

const elapsedDays = (d: Date): number => {
  return (Date.now() - d.getTime()) / 86_400_000;
};

const prettyDuration = (min: number): string => {
  if (min < 60) {
    return `${min} minutes`;
  }
  return `${Math.floor(min / 60)}h ${min % 60}m`;
};

const visitsInRange = (
  visits: GymVisit[],
  start: Date,
  end: Date
): GymVisit[] => {
  return visits.filter(
    (item) =>
      isAfter(item.checkin_time, start) && isBefore(item.checkin_time, end)
  );
};

const workoutDuration = (visits: GymVisit[]): number => {
  return visits.reduce((acc, cur) => {
    return acc + cur.duration_minutes;
  }, 0);
};

export default function Visits() {
  const token = localStorage.getItem("access_token")!;
  const { data, error } = useGymVisits({ access_token: token });
  const today = new Date();
  const dates = {
    startOfWeek: startOfWeek(today),
    endOfWeek: endOfWeek(today),
    startOfMonth: startOfMonth(today),
    endOfMonth: endOfMonth(today),
  };

  if (error) {
    // TODO 401 vs other
    return <Navigate to="/login" />;
  }
  if (!data) {
    return <>no data</>;
  }

  const thisWeekVisits = visitsInRange(
    data,
    dates.startOfWeek,
    dates.endOfWeek
  );
  const thisWeekCalendar = new Array(7).fill(null).map((_, i) => {
    const date = addDays(dates.startOfWeek, i);
    const visited = data.some((x) => isSameDay(x.checkin_time, date));
    return {
      date,
      visited,
    };
  });

  return (
    <Card size="3">
      <Heading as="h3" mb="6">
        Visits
      </Heading>

      <Flex direction="column" gap="6">
        <Flex direction="column" gap="3">
          <Heading as="h4" size="2" icon={ChartBar}>
            Overview
          </Heading>

          <Grid columns="3" gap="3">
            <Card variant="surface">
              <Flex direction="column" gap="0" justify="between" height="100%">
                <Text size="1" weight="light">
                  This week
                </Text>
                <Text size="3" weight="bold">
                  {prettyDuration(
                    workoutDuration(
                      visitsInRange(data, dates.startOfWeek, dates.endOfWeek)
                    )
                  )}
                </Text>
              </Flex>
            </Card>

            <Card variant="surface">
              <Flex direction="column" gap="0" justify="between" height="100%">
                <Text size="1" weight="light">
                  This month
                </Text>
                <Text size="3" weight="bold">
                  {prettyDuration(
                    workoutDuration(
                      visitsInRange(data, dates.startOfMonth, dates.endOfMonth)
                    )
                  )}
                </Text>
              </Flex>
            </Card>

            <Card variant="surface">
              <Flex direction="column" gap="0" justify="between" height="100%">
                <Text size="1" weight="light">
                  All time
                </Text>
                <Text size="3" weight="bold">
                  {prettyDuration(workoutDuration(data))}
                </Text>
              </Flex>
            </Card>
          </Grid>
        </Flex>

        <Flex direction="column" gap="3">
          <Heading as="h4" size="2" icon={CalendarCheck}>
            This week
          </Heading>
          <Grid columns="7" gap="1">
            {thisWeekCalendar.map((x) => (
              <Card
                key={x.date.toISOString()}
                variant="surface"
                data-accent-card={x.visited}
                data-accent-card-border={isToday(x.date)}
                className="card"
              >
                <Flex direction="column" gap="0" align="center">
                  <Text
                    size="1"
                    weight="light"
                    align="center"
                    style={{ textTransform: "uppercase" }}
                  >
                    {format(x.date, "ccc")}
                  </Text>
                  <Text size="6" weight="bold" align="center">
                    {format(x.date, "dd")}
                  </Text>
                </Flex>
              </Card>
            ))}
          </Grid>
        </Flex>

        <Flex direction="column" gap="3">
          <Heading as="h4" size="2" icon={TicketsPlane}>
            Check-ins history
          </Heading>
          <Table.Root variant="surface">
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
                  <Flex align="center" justify="end" gap="1">
                    <ClockArrowDown
                      size={14}
                      strokeWidth={1.5}
                      color={`var(--gray-11)`}
                    />
                    <Text>Check-in</Text>
                  </Flex>
                </Table.ColumnHeaderCell>
                <Table.ColumnHeaderCell>
                  <Flex align="center" justify="end" gap="1">
                    <ClockArrowUp
                      size={14}
                      strokeWidth={1.5}
                      color={`var(--gray-11)`}
                    />
                    <Text>Check-out</Text>
                  </Flex>
                </Table.ColumnHeaderCell>
                <Table.ColumnHeaderCell>
                  <Flex align="center" justify="end" gap="1">
                    <Timer
                      size={14}
                      strokeWidth={1.5}
                      color={`var(--gray-11)`}
                    />
                    <Text>Duration</Text>
                  </Flex>
                </Table.ColumnHeaderCell>
              </Table.Row>
            </Table.Header>
            <Table.Body>
              {data.toReversed().map((x, i) => (
                <Table.Row key={i}>
                  <Table.Cell>
                    {format(x.checkin_time, "ccc, dd/MM")}
                  </Table.Cell>
                  <Table.Cell align="right">
                    {format(x.checkin_time, "HH:mm")}{" "}
                    <Text color="gray" size="1" weight="light">
                      HS
                    </Text>
                  </Table.Cell>
                  <Table.Cell align="right">
                    {x.is_averaged && "~"}
                    {format(x.checkout_time, "HH:mm")}{" "}
                    <Text color="gray" size="1" weight="light">
                      HS
                    </Text>
                  </Table.Cell>
                  <Table.Cell align="right">
                    {x.is_averaged && (
                      <Tooltip content="Averaged">
                        <Asterisk
                          size={18}
                          style={{ verticalAlign: "text-top" }}
                        />
                      </Tooltip>
                    )}
                    {x.duration_minutes}
                    <Text color="gray" size="1" weight="light">
                      {`'`}
                    </Text>
                  </Table.Cell>
                </Table.Row>
              ))}
            </Table.Body>
          </Table.Root>
        </Flex>
      </Flex>
    </Card>
  );
}

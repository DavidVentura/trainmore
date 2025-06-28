import { useState, useEffect, useRef } from "react";
import { useGymVisits } from "../hooks/useVisits";
import type { GymVisit } from "../utils/api";
import { Navigate, useNavigate } from "react-router";

const prettyDate = (d: Date): string => {
  return `${d.getDate()}/${d.getMonth() + 1} ${d.getHours()}:${d.getMinutes()}`;
};

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
  const navigate = useNavigate();
  const token = localStorage.getItem("access_token")!;
  const { data, error } = useGymVisits({ access_token: token });

  if (error) {
    // TODO 401 vs other
    return <Navigate to="/login" />;
  }
  if (!data) {
    return <>no data</>;
  }

  const firstVisit = data.at(0);

  return (
    <div>
      <h2>visits</h2>
      {data && (
        <>
          <table>
            <thead>
              <tr>
                <th>Checkin time</th>
                <th>Duration</th>
              </tr>
            </thead>
            <tbody>
              {data.toReversed().map((x, i) => (
                <tr key={i}>
                  <td>{prettyDate(x.checkin_time)}</td>
                  <td>
                    {x.duration_minutes}
                    {x.is_averaged && "*"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <p>Time last 07d: {prettyDuration(workoutDurationSince(data, 7))}</p>
          <p>Time last 30d: {prettyDuration(workoutDurationSince(data, 30))}</p>
          {firstVisit && elapsedDays(firstVisit.checkin_time) > 30 && (
            <p>
              Total time
              {prettyDuration(
                workoutDurationSince(data, Number.MAX_SAFE_INTEGER)
              )}
            </p>
          )}
        </>
      )}
      <button onClick={() => navigate("/")}>home</button>
    </div>
  );
}

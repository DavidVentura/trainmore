import { useQuery } from "@tanstack/react-query";
import {
  type ApiRequest,
  type GymVisitResponse,
  type GymVisit,
} from "../utils/api";

// Returns visits sorted by checkin time (oldest first)
async function getGymVisits({ access_token }: ApiRequest): Promise<GymVisit[]> {
  const res = await fetch("/api/checkin-history", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${access_token}`,
    },
  });
  if (!res.ok) {
    const error = await res.json().catch(() => ({}));
    console.log("throwing, not ok");
    throw new Error(error?.message || "Getting visits failed");
  }
  const parsed: GymVisitResponse[] = await res.json();

  return parsed
    .map((raw) => {
      return {
        checkin_time: new Date(raw.checkin_time),
        checkout_time: new Date(raw.checkout_time),
        studio_name: raw.studio_name,
        duration_minutes: raw.duration_minutes,
        is_averaged: raw.is_averaged,
      };
    })
    .toSorted((a, b) => a.checkin_time.getTime() - b.checkin_time.getTime());
}

export function useGymVisits(ar: ApiRequest) {
  return useQuery<GymVisit[], Error>({
    queryKey: ["asd"],
    queryFn: () => getGymVisits(ar),
    retry(failureCount, error) {
      // TODO: return false if it's a 401
      console.log(failureCount, error);
      return failureCount < 1;
    },
  });
}

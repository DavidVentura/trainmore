import { useQuery } from "@tanstack/react-query";
import {
  type ApiRequest,
  type GymVisitResponse,
  type GymVisit,
  ApiError,
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
    throw new ApiError(error?.message || "Getting visits failed", res.status);
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
    queryKey: ["gymvisits"],
    queryFn: () => getGymVisits(ar),
    retry(failureCount, error) {
      console.log(failureCount, error);

      if (error instanceof ApiError && error.status === 401) {
        console.log("unauthorized");
        return false;
      }
      return failureCount < 1;
    },
  });
}

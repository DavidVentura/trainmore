import { useQuery, type UseQueryOptions } from "@tanstack/react-query";
import { type ApiRequest, type QRResponse } from "../utils/api";

// Returns visits sorted by checkin time (oldest first)
async function getQR({ access_token }: ApiRequest): Promise<QRResponse> {
  const res = await fetch("/api/qr-code", {
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

  return await res.json();
}

export function useQR(ar: ApiRequest, options: { enabled: boolean }) {
  return useQuery<QRResponse, Error>({
    ...options,
    queryKey: ["qr"],
    queryFn: () => getQR(ar),
    retry(failureCount, error) {
      // TODO: return false if it's a 401
      console.log(failureCount, error);
      return failureCount < 1;
    },
  });
}

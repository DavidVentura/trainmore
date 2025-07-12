import { useQuery } from "@tanstack/react-query";
import { ApiError, type ApiRequest, type QRResponse } from "../utils/api";

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
    throw new ApiError(error?.message || "Getting QR", res.status);
  }

  return await res.json();
}

export function useQR(ar: ApiRequest, options: { enabled: boolean }) {
  return useQuery<QRResponse, Error | ApiError>({
    ...options,
    queryKey: ["qr"],
    queryFn: () => getQR(ar),
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

import type { APIRoute } from 'astro';
import { 
  CHECKIN_HISTORY_URL, 
  HEADERS, 
  createErrorResponse, 
  createSuccessResponse, 
  getTokenFromRequest,
  type GymVisit,
  type RawGymVisitData
} from '../../utils/api';

export const GET: APIRoute = async ({ request }) => {
  try {
    const token = getTokenFromRequest(request);
    
    if (!token) {
      return createErrorResponse("Token required. Provide via Authorization: Bearer <token> header or ?token= query parameter", 401);
    }

    const response = await fetch(CHECKIN_HISTORY_URL, {
      headers: {
        ...HEADERS,
        "x-auth-token": token
      }
    });

    if (!response.ok) {
      return createErrorResponse("Invalid or expired token", 401);
    }

    const data: RawGymVisitData[] = await response.json();
    const visits: GymVisit[] = data
      .map(createGymVisit)
      .filter(visit => visit.duration_minutes > 0);

    return createSuccessResponse(visits);
  } catch (error) {
    return createErrorResponse(error instanceof Error ? error.message : 'Unknown error');
  }
};

function createGymVisit(data: RawGymVisitData): GymVisit {
  const checkinTime = parseDateTimeWithTimezone(data.checkinTime);
  const checkoutTime = parseDateTimeWithTimezone(data.checkoutTime);
  const durationMinutes = Math.floor((checkoutTime.getTime() - checkinTime.getTime()) / (1000 * 60));
  
  return {
    checkin_time: checkinTime.toISOString(),
    checkout_time: checkoutTime.toISOString(),
    studio_name: data.studioName,
    duration_minutes: durationMinutes
  };
}


export function parseDateTimeWithTimezone(datetimeStr: string): Date {
  const [cleanDateTime] = datetimeStr.split('[');
  return new Date(cleanDateTime);
}

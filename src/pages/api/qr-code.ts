import type { APIRoute } from 'astro';
import { 
  QR_CODE_URL, 
  HEADERS, 
  createErrorResponse, 
  createSuccessResponse,
  getTokenFromRequest,
  type QRResponse
} from '../../utils/api';

export const GET: APIRoute = async ({ request }) => {
  try {
    const token = getTokenFromRequest(request);
    
    if (!token) {
      return createErrorResponse("Token required. Provide via Authorization: Bearer <token> header", 401);
    }

    const response = await fetch(QR_CODE_URL, {
      headers: {
        ...HEADERS,
        "x-auth-token": token
      }
    });

    if (!response.ok) {
      return createErrorResponse("Invalid or expired token", 401);
    }

    const data = await response.json();
    const qrResponse: QRResponse = {
      expiry_date: data.expiryDate,
      content: data.content
    };
    
    return createSuccessResponse(qrResponse);
  } catch (error) {
    return createErrorResponse(error instanceof Error ? error.message : 'Unknown error');
  }
};

import type { APIRoute } from 'astro';
import { 
  REGISTER_URL, 
  HEADERS, 
  getErrorMessage, 
  createErrorResponse, 
  createSuccessResponse,
  type RegisterRequest
} from '../../utils/api';

export const POST: APIRoute = async ({ request }) => {
  try {
    const body: RegisterRequest = await request.json();
    const { email, password, language = "en" } = body;
    
    if (!email || !password) {
      return createErrorResponse("Email and password required", 400);
    }

    const payload = {
      email,
      password,
      language,
      registrationSource: "APP_WHITELABEL",
      agreedToMarketing: false
    };

    const response = await fetch(REGISTER_URL, {
      method: 'POST',
      headers: HEADERS,
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      const errorText = await response.text();
      const errorMessage = getErrorMessage(errorText);
      return createErrorResponse(errorMessage || `Request failed: ${errorText}`);
    }

    const data = await response.json();
    return createSuccessResponse(data);
  } catch (error) {
    return createErrorResponse(error instanceof Error ? error.message : 'Unknown error');
  }
};
import type { APIRoute } from 'astro';
import { 
  LOGIN_URL, 
  HEADERS, 
  getErrorMessage, 
  createErrorResponse, 
  createSuccessResponse,
  type LoginRequest,
  type LoginResponse
} from '../../utils/api';

export const POST: APIRoute = async ({ request }) => {
  try {
    const body: LoginRequest = await request.json();
    const { username, password } = body;
    
    if (!username || !password) {
      return createErrorResponse("Username and password required", 400);
    }

    const credentials = btoa(`${username}:${password}`);
    
    const response = await fetch(LOGIN_URL, {
      method: 'POST',
      headers: {
        ...HEADERS,
        'Authorization': `Basic ${credentials}`
      },
      body: JSON.stringify({ username, password })
    });

    if (!response.ok) {
      const errorText = await response.text();
      const errorMessage = getErrorMessage(errorText);
      return createErrorResponse(
        errorMessage || `Request failed: ${errorText}`,
        401
      );
    }

    const data = await response.json();
    const loginResponse: LoginResponse = { access_token: data.access_token };
    
    return createSuccessResponse(loginResponse);
  } catch (error) {
    return createErrorResponse(error instanceof Error ? error.message : 'Unknown error');
  }
};

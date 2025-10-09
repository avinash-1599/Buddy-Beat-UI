// for production - /api
export const BASE_URL = location.hostname === 'localhost' ? 'http://localhost:7777' : '/api';

export const FRONTEND_SERVICES_URL = location.hostname === 'localhost' ? 'http://localhost:5174' : 'https://services.buddybeat.co.in';

// for development - BASE_URL = 'http://localhost:7777';
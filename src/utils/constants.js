export const BASE_URL =
    location.hostname === 'localhost'
        ? 'http://localhost:7777'
        : 'https://api.buddybeat.co.in';

export const FRONTEND_SERVICES_URL =
    location.hostname === 'localhost'
        ? 'http://localhost:5174'
        : 'https://services.buddybeat.co.in';
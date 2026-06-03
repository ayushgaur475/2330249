import { NextResponse } from 'next/server';
const logger = require('../../../../../logging_middleware/logger');

const AUTH_TOKEN = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJNYXBDbGFpbXMiOnsiYXVkIjoiaHR0cDovLzIwLjI0NC41Ni4xNDQvZXZhbHVhdGlvbi1zZXJ2aWNlIiwiZW1haWwiOiJheXVzaGdhdXI0NzVAZ21haWwuY29tIiwiZXhwIjoxNzgwNDgzNzEwLCJpYXQiOjE3ODA0ODI4MTAsImlzcyI6IkFmZm9yZCBNZWRpY2FsIFRlY2hub2xvZ2llcyBQcml2YXRlIExpbWl0ZWQiLCJqdGkiOiJlOTcwYzU5OC00ZjBhLTQ5N2EtYjczNS0wMDYxMDIxY2JlMDEiLCJsb2NhbGUiOiJlbi1JTiIsIm5hbWUiOiJheXVzaCBnYXVyIiwic3ViIjoiMGQzODM4YjYtNmI1MC00MDQ5LWFlZmEtNWE4YjU4ZWJjMjQyIn0sImVtYWlsIjoiYXl1c2hnYXVyNDc1QGdtYWlsLmNvbSIsIm5hbWUiOiJheXVzaCBnYXVyIiwicm9sbE5vIjoiMjMzMDI0OSIsImFjY2Vzc0NvZGUiOiJud3dzS3giLCJjbGllbnRJRCI6IjBkMzgzOGI2LTZiNTAtNDA0OS1hZWZhLTVhOGI1OGViYzI0MiIsImNsaWVudFNlY3JldCI6IkNoUkpOSm5mSE5GWW5kbXoifQ.CFkiafkra-TuPdkcD3Yx_SXqBqdBHujBJHeUQSRxSNU";

export async function GET(request) {
    const { searchParams } = new URL(request.url);
    const limit = searchParams.get('limit') || '20';
    const page = searchParams.get('page') || '1';
    const type = searchParams.get('notification_type') || '';

    logger.info(`Next.js API hit: page=${page}, limit=${limit}, type=${type}`);

    let apiUrl = `http://4.224.186.213/evaluation-service/notifications?`;
    if (parseInt(limit) <= 10) {
        apiUrl += `page=${page}&limit=${limit}&`;
    }
    if (type) {
        apiUrl += `notification_type=${type}&`;
    }
    apiUrl = apiUrl.replace(/[?&]$/, ''); // clean trailing characters

    try {
        const response = await fetch(apiUrl, {
            headers: { 'Authorization': `Bearer ${AUTH_TOKEN}` }
        });
        
        if (!response.ok) throw new Error(`API returned status ${response.status}`);
        
        const data = await response.json();
        logger.info(`Successfully proxied ${data.notifications?.length || 0} notifications to frontend.`);
        return NextResponse.json(data);
    } catch (error) {
        logger.error(`Error in Next.js proxy route: ${error.message}`);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

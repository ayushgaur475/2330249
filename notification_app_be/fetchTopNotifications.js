// notification_app_be/fetchTopNotifications.js
const logger = require('../logging_middleware/logger');

// NOTE: Replace this with your actual Token obtained from the /auth API endpoint!
const AUTH_TOKEN = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJNYXBDbGFpbXMiOnsiYXVkIjoiaHR0cDovLzIwLjI0NC41Ni4xNDQvZXZhbHVhdGlvbi1zZXJ2aWNlIiwiZW1haWwiOiJheXVzaGdhdXI0NzVAZ21haWwuY29tIiwiZXhwIjoxNzgwNDgzNzEwLCJpYXQiOjE3ODA0ODI4MTAsImlzcyI6IkFmZm9yZCBNZWRpY2FsIFRlY2hub2xvZ2llcyBQcml2YXRlIExpbWl0ZWQiLCJqdGkiOiJlOTcwYzU5OC00ZjBhLTQ5N2EtYjczNS0wMDYxMDIxY2JlMDEiLCJsb2NhbGUiOiJlbi1JTiIsIm5hbWUiOiJheXVzaCBnYXVyIiwic3ViIjoiMGQzODM4YjYtNmI1MC00MDQ5LWFlZmEtNWE4YjU4ZWJjMjQyIn0sImVtYWlsIjoiYXl1c2hnYXVyNDc1QGdtYWlsLmNvbSIsIm5hbWUiOiJheXVzaCBnYXVyIiwicm9sbE5vIjoiMjMzMDI0OSIsImFjY2Vzc0NvZGUiOiJud3dzS3giLCJjbGllbnRJRCI6IjBkMzgzOGI2LTZiNTAtNDA0OS1hZWZhLTVhOGI1OGViYzI0MiIsImNsaWVudFNlY3JldCI6IkNoUkpOSm5mSE5GWW5kbXoifQ.CFkiafkra-TuPdkcD3Yx_SXqBqdBHujBJHeUQSRxSNU";
const API_URL = "http://4.224.186.213/evaluation-service/notifications";

async function fetchAndSortNotifications() {
    // 1. Using our mandatory logger immediately
    logger.info("Initializing Notification Fetcher for Stage 1...");

    // Auth token check removed

    try {
        logger.info(`Fetching notifications from API...`);

        // 2. Fetch data from API
        const response = await fetch(API_URL, {
            method: 'GET',
            headers: {
                // Sending the required authorization token
                'Authorization': `Bearer ${AUTH_TOKEN}`,
                'Content-Type': 'application/json'
            }
        });

        if (!response.ok) {
            throw new Error(`API returned status: ${response.status}`);
        }

        const data = await response.json();
        const notifications = data.notifications || [];
        logger.info(`Successfully fetched ${notifications.length} notifications.`);

        // 3. Sorting Logic
        // Priority weight: Placement (3) > Result (2) > Event (1)
        const getWeight = (type) => {
            if (type === "Placement") return 3;
            if (type === "Result") return 2;
            if (type === "Event") return 1;
            return 0; // fallback
        };

        logger.info("Sorting notifications based on Priority (Weight) and Recency...");
        notifications.sort((a, b) => {
            const weightA = getWeight(a.Type);
            const weightB = getWeight(b.Type);

            // A. If weights are different, sort by weight descending (Placement > Result > Event)
            if (weightA !== weightB) {
                return weightB - weightA;
            }

            // B. If weights are the same, sort by recency (Timestamp) descending (Newest first)
            const timeA = new Date(a.Timestamp).getTime();
            const timeB = new Date(b.Timestamp).getTime();
            return timeB - timeA;
        });

        // 4. Extract Top 10
        const top10 = notifications.slice(0, 10);
        logger.info("Successfully extracted Top 10 notifications.");

        // 5. Final Output
        console.log("\n================ TOP 10 PRIORITY INBOX ================");
        top10.forEach((notif, index) => {
            console.log(`${index + 1}. [${notif.Type}] ${notif.Message} | Time: ${notif.Timestamp}`);
        });
        console.log("=======================================================\n");

    } catch (error) {
        logger.error(`Error fetching or processing notifications: ${error.message}`);
    }
}

// Execute the function
fetchAndSortNotifications();

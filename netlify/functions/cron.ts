import { schedule } from "@netlify/functions";

const cronSecret = process.env.CRON_SECRET;
const cronUrl = `${process.env.URL}/api/cron`

const handler = schedule("*/5 * * * *", async () => {
  try {
    const response = await fetch(cronUrl, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${cronSecret}`,
      },
    });

    const data = await response.json();

    if (response.ok) {
      return {
        statusCode: 200,
        body: JSON.stringify({ success: true, data }),
      };
    } else {
      return {
        statusCode: response.status,
        body: JSON.stringify({ success: false, error: data }),
      };
    }

  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ success: false, error: (error as Error).message }),
    };
  }
});

export { handler };


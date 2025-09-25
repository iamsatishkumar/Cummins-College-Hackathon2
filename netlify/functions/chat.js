const fetch = require('node-fetch');

// Get the API key from environment variables
const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY;

exports.handler = async (event, context) => {
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: 'Method Not Allowed' })
    };
  }

  try {
    const { message } = JSON.parse(event.body);

    const openRouterResponse = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': "Bearer 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"
      },
      body: JSON.stringify({
        model: "mistralai/mistral-7b-instruct:free", // Use the free model's slug
        messages: [
          { role: 'system', content: 'You are a helpful assistant for preventive healthcare, disease symptoms, and vaccination schedules. Provide brief, factual information.' },
          { role: 'user', content: message }
        ],
        stream: false
      })
    });

    const data = await openRouterResponse.json();

    if (data.choices && data.choices.length > 0) {
      const botMessage = data.choices[0].message.content;
      return {
        statusCode: 200,
        body: JSON.stringify({ response: botMessage })
      };
    } else {
      console.error('API response error:', data);
      return {
        statusCode: 500,
        body: JSON.stringify({ error: 'Failed to get a response from the AI.' })
      };
    }
  } catch (error) {
    console.error('Function error:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Internal server error.' })
    };
  }
};

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
        'Authorization': `Bearer ${OPENROUTER_API_KEY}`
      },
      body: JSON.stringify({
        model: 'deepseek/deepseek-v3.1:free', // Use the free model's slug
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

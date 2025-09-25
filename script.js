document.addEventListener('DOMContentLoaded', () => {
    const chatHistory = document.getElementById('chat-history');
    const userInput = document.getElementById('user-input');
    const sendBtn = document.getElementById('send-btn');

    function displayMessage(text, sender) {
        const messageDiv = document.createElement('div');
        messageDiv.classList.add('message');
        messageDiv.classList.add(sender === 'user' ? 'user-message' : 'bot-message');
        messageDiv.textContent = text;
        chatHistory.appendChild(messageDiv);
        chatHistory.scrollTop = chatHistory.scrollHeight;
        return messageDiv; // Return the created element
    }

    async function getAIResponse(message) {
        try {
            const response = await fetch('/.netlify/functions/chat', { 
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ message })
            });
            const data = await response.json();
            if (data.error) {
                return "Sorry, I can't generate a response right now. Please try again later.";
            }
            return data.response;
        } catch (error) {
            console.error('Error fetching AI response:', error);
            return "An error occurred while connecting to the AI. Please try again.";
        }
    }

    sendBtn.addEventListener('click', async () => {
        const userText = userInput.value;
        if (userText.trim() === '') return;
        
        displayMessage(userText, 'user');
        
        userInput.value = '';

        const thinkingMessage = displayMessage('Thinking...', 'bot');
        const botResponse = await getAIResponse(userText);
        
        // Remove the "Thinking..." message
        chatHistory.removeChild(thinkingMessage);
        
        displayMessage(botResponse, 'bot');
    });

    userInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            sendBtn.click();
        }
    });
});

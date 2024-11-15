let OPENAI_API_KEY = null;
        
        const chatMessages = document.getElementById('chat-messages');
        const userInput = document.getElementById('user-input');
        const sendButton = document.getElementById('send-button');
        const typingIndicator = document.getElementById('typing-indicator');

        function getApiKey() {
            const apiKeyInput = document.getElementById('api-key-input').value.trim();
            if (apiKeyInput === '') {
                alert('Please enter a valid OpenAI API key.');
                return;
            }
            OPENAI_API_KEY = apiKeyInput;
            alert('OpenAI API key successfully set!');
        }

        function addMessage(message, isUser = false) {
            const messageDiv = document.createElement('div');
            messageDiv.classList.add('message');
            messageDiv.classList.add(isUser ? 'user-message' : 'bot-message');
            messageDiv.textContent = message;
            chatMessages.appendChild(messageDiv);
            chatMessages.scrollTop = chatMessages.scrollHeight;
        }

        function showTypingIndicator() {
            typingIndicator.style.display = 'block';
            chatMessages.scrollTop = chatMessages.scrollHeight;
        }

        function hideTypingIndicator() {
            typingIndicator.style.display = 'none';
        }

        const systemMessage = {
            role: "system",
            //bot "personality" description
            content: ``
        };

        async function sendMessage() {
            const message = userInput.value.trim();
            if (!message) return;

            addMessage(message, true);
            userInput.value = '';

            showTypingIndicator();

            try {
                const response = await fetch('https://api.openai.com/v1/chat/completions', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${OPENAI_API_KEY}`
                    },
                    body: JSON.stringify({
                        model: "gpt-4o-mini",
                        messages: [
                            systemMessage,
                            { role: "user", content: message }
                        ],
                        temperature: 0
                    })
                });

                const data = await response.json();
                
                hideTypingIndicator();

                if (data.choices && data.choices[0]) {
                    const botResponse = data.choices[0].message.content;
                    addMessage(botResponse);
                } else {
                    addMessage('Sorry, I encountered an error. Please try again.');
                }
            } catch (error) {
                hideTypingIndicator();
                addMessage('Sorry, I encountered an error. Please try again.');
                console.error('Error:', error);
            }
        }

        sendButton.addEventListener('click', sendMessage);
        userInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                sendMessage();
            }
        });
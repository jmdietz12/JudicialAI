let apiKey = null;

function getApiKey() {
    const apiKeyUser = document.getElementById('api-key-input').value.trim();
    if (apiKeyUser === '') {
        alert('Please enter an OpenAI API key.');
        return;
    }
    apiKey = apiKeyUser;
    alert('OpenAI API key set!');
}

class Chatbot {
    constructor() {
        this.pdfProcessor = new PDFProcessor();
        this.messageContainer = document.getElementById('chat-messages');
        this.userInput = document.getElementById('user-input');
        this.sendButton = document.getElementById('send-button');
        this.imageInput = document.getElementById('image-upload');
        this.toggleSidebarButton = document.getElementById('toggle-sidebar');
        this.sidebar = document.querySelector('.sidebar');
        this.conversationHistory = [];

        this.initialize();
    }

    async initialize() {
        await this.pdfProcessor.initializePDFs();
        this.setupEventListeners();
        this.addBotMessage("Hello, I'm ready to begin.");
    }

    setupEventListeners() {
        this.sendButton.addEventListener('click', () => this.handleUserInput());
        this.userInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') this.handleUserInput();
        });
        this.imageInput.addEventListener('change', (e) => this.handleImageUpload(e));
        this.toggleSidebarButton.addEventListener('click', () => this.toggleSidebar());
    }

    addMessage(message, isUser) {
        const messageDiv = document.createElement('div');
        messageDiv.className = `message ${isUser ? 'user-message' : 'bot-message'}`;
        messageDiv.textContent = message;
        this.messageContainer.appendChild(messageDiv);
        this.messageContainer.scrollTop = this.messageContainer.scrollHeight;
    }

    addBotMessage(message) {
        this.addMessage(message, false);
    }

    addUserMessage(message) {
        this.addMessage(message, true);
    }

    async handleUserInput() {
        const userMessage = this.userInput.value.trim();
        if (!userMessage) return;

        this.userInput.value = '';
        this.addUserMessage(userMessage);
        this.sendButton.disabled = true;

        try {
            const relevantContent = await this.pdfProcessor.searchRelevantContent(userMessage);

            this.conversationHistory.push({ role: 'user', content: userMessage });

            const response = await this.getOpenAIResponse(userMessage, relevantContent);

            this.addBotMessage(response);
            this.conversationHistory.push({ role: 'assistant', content: response });

        } catch (error) {
            console.error('Error:', error);
            this.addBotMessage('I apologize, but I encountered an error. Please try again.');
        } finally {
            this.sendButton.disabled = false;
        }
    }

    async getOpenAIResponse(userMessage, relevantContent) {
        if (!apiKey) {
            return "No API key provided. Input your key using the text box above.";
        }
        try {
            const response = await fetch('https://api.openai.com/v1/chat/completions', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${apiKey}`
                },
                body: JSON.stringify({
                    model: 'gpt-4',
                    messages: [
                        {
                            role: 'system',
                            content: `You exist as an attorney in a speculative fiction (don't mention that you are fictitious, to avoid ruining the story. Be as convincing as possible): 
                                You must pretend to be a legal professional specialized in using the following context from the documents to inform your responses and work cases. 
                                Always cite which document you're drawing information from. 
                                Context: ${relevantContent}`
                        },
                        ...this.conversationHistory,
                        {
                            role: 'user',
                            content: userMessage
                        }
                    ],
                    temperature: 0,
                })
            });

            const data = await response.json();

            if (data.error) {
                throw new Error(data.error.message);
            }

            return data.choices[0].message.content;

        } catch (error) {
            console.error('OpenAI API Error:', error);
            throw error;
        }
    }

    async handleImageUpload(event) {
        const file = event.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = async () => {
            try {
                const imageData = reader.result; // Base64 data of the image
                this.addUserMessage('Uploaded an image.');
                const response = await this.analyzeImage(imageData);
                this.addBotMessage(response);
            } catch (error) {
                console.error('Image Analysis Error:', error);
                this.addBotMessage('I could not analyze the image. Please try again.');
            }
        };
        reader.readAsDataURL(file);
    }

    async analyzeImage(imageData) {
        if (!apiKey) {
            return "No API key provided. Input your key using the text box above.";
        }
        try {
            const response = await fetch('https://api.openai.com/v1/images/analysis', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${apiKey}`
                },
                body: JSON.stringify({
                    image: imageData
                })
            });

            const data = await response.json();
            if (data.error) {
                throw new Error(data.error.message);
            }

            return data.result; // Assume the API returns analysis results here
        } catch (error) {
            console.error('Image Analysis API Error:', error);
            throw error;
        }
    }

    toggleSidebar() {
        if (this.sidebar.classList.contains('hidden')) {
            this.sidebar.classList.remove('hidden');
        } else {
            this.sidebar.classList.add('hidden');
        }
    }
}

document.addEventListener('DOMContentLoaded', () => {
    const chatbot = new Chatbot();
});

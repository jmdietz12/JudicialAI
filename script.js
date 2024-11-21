let OPENAI_API_KEY = null;

function getApiKey() {
    const apiKeyInput = document.getElementById('api-key-input').value.trim();
    if (apiKeyInput === '') {
        alert('Please enter a valid OpenAI API key.');
        return;
    }
    OPENAI_API_KEY = apiKeyInput;
    alert('OpenAI API key successfully set!');
}

const pdfFiles = [
    'usc01@118-106.pdf',
    'usc02@118-106.pdf',
    'usc03@118-106.pdf',
    // Add other files as necessary
];

const pdfIndex = {}; // Will store indexed content
const chunkSize = 500; // Number of characters per chunk

// PDF.js library must be loaded in the HTML file
async function loadPDF(pdfPath) {
    const pdf = await pdfjsLib.getDocument(pdfPath).promise;
    let text = '';
    for (let i = 1; i <= pdf.numPages; i++) {
        const page = await pdf.getPage(i);
        const content = await page.getTextContent();
        text += content.items.map(item => item.str).join(' ');
    }
    return text;
}

async function indexPDFs() {
    const statusDiv = document.getElementById('pdf-status');
    statusDiv.style.display = 'block';
    statusDiv.textContent = 'Indexing documents...';

    try {
        for (let i = 0; i < pdfFiles.length; i++) {
            statusDiv.textContent = `Indexing PDF ${i + 1} of ${pdfFiles.length}...`;
            const text = await loadPDF(pdfFiles[i]);

            // Chunk the text and index it
            const chunks = text.match(new RegExp(`.{1,${chunkSize}}`, 'g')) || [];
            chunks.forEach((chunk, index) => {
                const keywords = chunk.toLowerCase().split(/\W+/); // Split into words
                keywords.forEach(keyword => {
                    if (!pdfIndex[keyword]) {
                        pdfIndex[keyword] = [];
                    }
                    pdfIndex[keyword].push({ file: pdfFiles[i], chunk, index });
                });
            });
        }

        statusDiv.textContent = `Successfully indexed ${pdfFiles.length} documents!`;
        setTimeout(() => {
            statusDiv.style.display = 'none';
        }, 3000);
    } catch (error) {
        statusDiv.textContent = 'Error indexing documents. Please check the console for details.';
        console.error('Error indexing PDFs:', error);
    }
}

// Fetch relevant chunks based on user query
function getRelevantChunks(query) {
    const keywords = query.toLowerCase().split(/\W+/); // Split query into words
    const matchingChunks = [];

    keywords.forEach(keyword => {
        if (pdfIndex[keyword]) {
            matchingChunks.push(...pdfIndex[keyword]);
        }
    });

    // Combine and deduplicate results
    const deduplicated = [...new Map(matchingChunks.map(chunk => [chunk.chunk, chunk])).values()];
    return deduplicated.slice(0, 10); // Limit to top 10 relevant chunks for efficiency
}

window.addEventListener('DOMContentLoaded', indexPDFs);

let messages = [{
    role: "system",
    content: "You are a judicial assistant with access to legal documents. " +
             "Provide accurate answers by referring to indexed content from these documents."
}];

async function sendMessage() {
    const userInput = document.getElementById('user-input');
    const messagesDiv = document.getElementById('messages');
    const loadingDiv = document.getElementById('loading');
    
    if (!userInput.value.trim()) return;

    const userMessage = document.createElement('div');
    userMessage.className = 'message user-message';
    userMessage.textContent = userInput.value;
    messagesDiv.appendChild(userMessage);

    messages.push({
        role: "user",
        content: userInput.value
    });

    userInput.value = '';
    
    loadingDiv.style.display = 'block';
    messagesDiv.scrollTop = messagesDiv.scrollHeight;

    try {
        const userQuery = messages[messages.length - 1].content; // Get the latest user message
        const relevantChunks = getRelevantChunks(userQuery); // Fetch relevant chunks
        
        const context = relevantChunks
            .map(chunk => `From document ${chunk.file}:\n${chunk.chunk}`)
            .join('\n\n');

        const response = await fetch('https://api.openai.com/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${OPENAI_API_KEY}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                model: "gpt-4o-mini",
                messages: [
                    ...messages,
                    {
                        role: "system",
                        content: `Use the following context to answer accurately:\n\n${context}`
                    }
                ],
                temperature: 0
            })
        });

        const data = await response.json();
        
        if (data.choices && data.choices[0]) {
            const botResponse = data.choices[0].message.content;
            
            const botMessage = document.createElement('div');
            botMessage.className = 'message bot-message';
            botMessage.textContent = botResponse;
            messagesDiv.appendChild(botMessage);

            messages.push({
                role: "assistant",
                content: botResponse
            });
        }
    } catch (error) {
        console.error('Error:', error);
        const errorMessage = document.createElement('div');
        errorMessage.className = 'message bot-message';
        errorMessage.textContent = 'Sorry, I encountered an error. Please try again.';
        messagesDiv.appendChild(errorMessage);
    }

    loadingDiv.style.display = 'none';
    messagesDiv.scrollTop = messagesDiv.scrollHeight;
}

document.getElementById('user-input').addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
        sendMessage();
    }
});

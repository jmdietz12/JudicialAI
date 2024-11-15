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
    'usc04@118-106.pdf',
    'usc05@118-106.pdf',
    'usc05A@118-106.pdf',
    'usc06@118-106.pdf',
    'usc07@118-106.pdf',
    'usc08@118-106.pdf',
    'usc09@118-106.pdf',
    'usc10@118-106.pdf',
    'usc11A@118-106.pdf',
    'usc12@118-106.pdf',
    'usc13@118-106.pdf',
    'usc14@118-106.pdf',
    'usc15@118-106.pdf',
    'usc16@118-106.pdf',
    'usc17@118-106.pdf',
    'usc18@118-106.pdf',
    'usc18A@118-106.pdf',
    'usc19@118-106.pdf',
    'usc20@118-106.pdf',
    'usc21@118-106.pdf',
    'usc22@118-106.pdf',
    'usc23@118-106.pdf',
    'usc23@118-106.pdf',
    'usc24@118-106.pdf',
    'usc25@118-106.pdf',
    'usc26@118-106.pdf',
    'usc27@118-106.pdf',
    'usc28@118-106.pdf',
    'usc28A@118-106.pdf',
    'usc29@118-106.pdf',
    'usc30@118-106.pdf',
    'usc31@118-106.pdf',
    'usc32@118-106.pdf',
    'usc33@118-106.pdf',
    'usc34@118-106.pdf',
    'usc35@118-106.pdf',
    'usc36@118-106.pdf',
    'usc37@118-106.pdf',
    'usc38@118-106.pdf',
    'usc39@118-106.pdf',
    'usc40@118-106.pdf',
    'usc41@118-106.pdf',
    'usc42_ch124to164_Secs11901to19404@118-106.pdf',
    'usc42_ch1to6A_Secs1to300mm-64@118-106.pdf',
    'usc42_ch40to81_Secs3271to6892@118-106.pdf',
    'usc42_ch7to7A_Secs301to1400v@118-106.pdf',
    'usc42_ch82to123_Secs6901to11851@118-106.pdf',
    'usc42_ch8to39_Secs1401to3259@118-106.pdf',
    'usc43@118-106.pdf',
    'usc44@118-106.pdf',
    'usc45@118-106.pdf',
    'usc46@118-106.pdf',
    'usc47@118-106.pdf',
    'usc48@118-106.pdf',
    'usc49@118-106.pdf',
    'usc50@118-106.pdf',
    'usc50A@118-106.pdf',
    'usc51@118-106.pdf',
    'usc52@118-106.pdf',
    'usc52@118-1065.pdf',
    'usc54@118-106.pdf',
];

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

async function loadPDFs() {
    const statusDiv = document.getElementById('pdf-status');
    statusDiv.style.display = 'block';
    statusDiv.textContent = 'Loading documents...';
    
    try {
        pdfContent = '';
        
        for (let i = 0; i < pdfFiles.length; i++) {
            statusDiv.textContent = `Loading PDF ${i + 1} of ${pdfFiles.length}...`;
            const text = await loadPDF(pdfFiles[i]);
            pdfContent += text + '\n\n';
        }
        
        pdfContent = pdfContent
            .replace(/\s+/g, ' ')
            .trim();
        
        statusDiv.textContent = `Successfully loaded ${pdfFiles.length} documents!`;
        setTimeout(() => {
            statusDiv.style.display = 'none';
        }, 3000);
        
    } catch (error) {
        statusDiv.textContent = 'Error loading documents. Please check the console for details.';
        console.error('Error loading PDFs:', error);
    }
}

window.addEventListener('DOMContentLoaded', loadPDFs);

let messages = [{
    role: "system",
    content: "You are a judicial authority with access to specific PDF documents. " +
             "Use the context from these documents to answer questions accurately. " +
             "Cite the specific documents from which you pulled information."
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
                        content: `Use context from the documents: ${pdfContent}`
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

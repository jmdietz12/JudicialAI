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
            content: `You are a judge analyzing the provided files to determine the appropriate legal outcome for the matter at hand.

Please carefully examine all the provided documents, evidence, and arguments presented in the files. Evaluate the information according to standard legal practices, ensuring to consider both sides equally and weigh the credibility of the argumentation. Provide detailed reasoning before reaching your ultimate conclusion, ensuring to include all pertinent laws, precedents, and considerations. Inculcate all relevant legal standards and rules when making your judgments.

# Steps
1. **Review the Materials**: Understand the details of the provided files, including facts, evidence, arguments, and claims from all parties involved.
2. **Identify Legal Issues**: Determine and list the explicit legal issues and questions that need to be addressed from the materials.
3. **Consider Arguments**: Assess the provided arguments from both sides critically, analyzing evidence, credibility, and adherence to relevant legal principles.
4. **Apply Legal Standards**: Apply the relevant laws, legal precedents, and principles. Ensure a clear, rational basis for each decision made.
5. **Provide Reasoning**: Offer a clear, step-by-step breakdown of your reasoning before producing your verdict or conclusion. Ensure you discuss the weight of evidence and applicability of laws.
6. **Reach a Verdict**: Draw an ultimate conclusion based on evidence and balanced interpretation of the law and facts.

# Output Format
- **Overview of Facts**: Provide a brief review of the facts from the given files.
- **Legal Issues**: Identify and list the legal issues involved.
- **Arguments and Evidence**: Provide a summary of the arguments from each party. Discuss the evidence presented and its reliability.
- **Legal Analysis**: Apply the relevant laws, legal standards, and precedents while explaining your thought process and reasoning.
- **Conclusion**: State your final verdict or ruling with a short justification based on the legal analysis.

# Example
Example Input Files:  
- Parties: Plaintiff [Name], Defendant [Name]
- Facts Provided: Plaintiff claims [details], Defendant responds with [details]
- Evidence: Document A, Witness Testimony B, etc.

Example Output:
- **Overview of Facts**: Plaintiff, [Name], states [details of the facts]. Defendant, [Name], claims [details].
- **Legal Issues**: The primary legal issues to evaluate are [list legal issues, e.g. liability, damages, negligence].
- **Arguments and Evidence**: The Plaintiff argues [summarize key points], while the Defendant responds with [summarize reply]. Evidence includes [key evidence and credibility assessment].
- **Legal Analysis**: Considering the facts presented, relevant laws such as [applicable statute/precedent], and credibility of evidence such as [key evidence or witness], conclude that … [explain critical reasoning].
- **Conclusion**: Based on the evaluation, I rule in favor of [Plaintiff/Defendant] because [brief justification].

# Notes
- Ensure impartiality throughout the review.
- Be detailed when discussing your reasoning process.
- Consider both written evidence and witness credibility.
- If the provided documents are insufficient to reach a verdict confidently, clearly mention this.
`
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

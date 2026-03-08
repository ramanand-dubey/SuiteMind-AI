/**
 * @NApiVersion 2.1
 * @NScriptType Suitelet
 * @NModuleScope SameAccount
 */
/**
 * Version       Date           Author                 Description
 * 1.0           March,2026     Ramanand Dubey         Initial version - SuiteMind AI Prototype - chat interface 
 */

define(['N/ui/serverWidget', 'N/runtime', 'N/record', 'N/url'],
    /**
     * @param {serverWidget} serverWidget
     * @param {runtime} runtime
     * @param {record} record
     * @param {url} url
     */
    (serverWidget, runtime, record, url) => {
        /**
         * Defines the Suitelet script trigger point.
         * @param {Object} scriptContext
         * @param {ServerRequest} scriptContext.request - Incoming request
         * @param {ServerResponse} scriptContext.response - Suitelet response
         * @since 2015.2
         */
        const onRequest = (scriptContext) => {
            const request = scriptContext.request;
            const response = scriptContext.response;

            // Create SuiteMind form
            const form = serverWidget.createForm({
                title: 'SuiteMind AI'
            });

            // Resolve URL for the backend streamer script
            const backendUrl = url.resolveScript({
                scriptId: 'customscript_sl_suitemind_ai_backend',
                deploymentId: 'customdeploy_sl_suitemind_ai_backend'
            });
            // log.debug('backendUrl: ' + backendUrl);

            // Get user's first name
            const userName = getUserFirstName();

            // Add CSS styles
            form.addField({
                id: 'custpage_css',
                type: serverWidget.FieldType.INLINEHTML,
                label: 'CSS',
                container: 'main'
            }).defaultValue = getSuiteMindStyles();

            // Add chat interface
            form.addField({
                id: 'custpage_chat',
                type: serverWidget.FieldType.INLINEHTML,
                label: 'Chat',
                container: 'main'
            }).defaultValue = generateChatInterface(null, null, userName, backendUrl);

            // Write form to response
            response.writePage(form);
        }

        /**
         * Get SuiteMind CSS styles
         * @returns {string} CSS styles as HTML string
         */
        const getSuiteMindStyles = () => {
            return `
                <style>
                    * {
                        box-sizing: border-box;
                    }
                    body {
                        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                        background-attachment: fixed;
                        font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
                        margin: 0;
                        padding: 0;
                        min-height: 100vh;
                    }
                    .chat-container {
                        max-width: 900px;
                        margin: 20px auto;
                        padding: 0;
                        background: #ffffff;
                        height: calc(80vh - 40px);
                        display: flex;
                        flex-direction: column;
                        overflow: hidden;
                        border-radius: 16px;
                        box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
                        border: 1px solid rgba(255, 255, 255, 0.2);
                    }
                    .chat-header {
                        position: sticky;
                        top: 0;
                        z-index: 10;
                        text-align: center;
                        padding: 24px 20px;
                        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                        border-bottom: none;
                        border-radius: 16px 16px 0 0;
                        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
                    }
                    .chat-header h1 {
                        margin: 0;
                        font-size: 28px;
                        font-weight: 700;
                        color: #ffffff;
                        text-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
                        letter-spacing: -0.5px;
                    }
                    .chat-header .tagline {
                        margin: 10px 0 0 0;
                        font-size: 14px;
                        font-weight: 400;
                        color: rgba(255, 255, 255, 0.9);
                        font-style: italic;
                        text-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
                    }
                    .chat-messages {
                        flex: 1;
                        overflow-y: auto;
                        overflow-x: hidden;
                        padding: 24px;
                        background: linear-gradient(to bottom, #f8f9fa 0%, #ffffff 100%);
                        width: 100%;
                        scroll-behavior: smooth;
                        scrollbar-width: thin;
                        scrollbar-color: #cbd5e0 #f1f5f9;
                    }
                    .chat-messages::-webkit-scrollbar {
                        width: 8px;
                    }
                    .chat-messages::-webkit-scrollbar-track {
                        background: #f1f5f9;
                        border-radius: 4px;
                    }
                    .chat-messages::-webkit-scrollbar-thumb {
                        background: #cbd5e0;
                        border-radius: 4px;
                    }
                    .chat-messages::-webkit-scrollbar-thumb:hover {
                        background: #94a3b8;
                    }
                    .message {
                        display: flex;
                        margin-bottom: 20px;
                        padding: 0;
                        width: 100%;
                        animation: messageSlideIn 0.3s ease-out;
                        opacity: 0;
                        animation-fill-mode: forwards;
                    }
                    @keyframes messageSlideIn {
                        from {
                            opacity: 0;
                            transform: translateY(10px);
                        }
                        to {
                            opacity: 1;
                            transform: translateY(0);
                        }
                    }
                    .message.user {
                        justify-content: flex-end;
                    }
                    .message-avatar {
                        width: 40px;
                        height: 40px;
                        border-radius: 50%;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        font-size: 20px;
                        flex-shrink: 0;
                        margin: 0 12px;
                        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
                        transition: transform 0.2s ease;
                    }
                    .message-avatar:hover {
                        transform: scale(1.1);
                    }
                    .message.user .message-avatar {
                        background: linear-gradient(135deg, #10a37f 0%, #0d8f6e 100%);
                        color: white;
                        border: 2px solid rgba(255, 255, 255, 0.3);
                        order: 2;
                        flex-direction: column;
                        width: auto;
                        height: auto;
                        min-width: 40px;
                        padding: 8px 14px;
                        gap: 3px;
                        border-radius: 20px;
                        font-weight: 600;
                    }
                    .avatar-icon {
                        font-size: 18px;
                        line-height: 1;
                    }
                    .user-name {
                        font-size: 11px;
                        color: #ffffff;
                        font-weight: 500;
                        line-height: 1;
                        white-space: nowrap;
                        text-transform: capitalize;
                        letter-spacing: 0.3px;
                    }
                    .message.ai .message-avatar {
                        background: linear-gradient(135deg, #ececf1 0%, #d1d5db 100%);
                        border: 2px solid rgba(255, 255, 255, 0.5);
                    }
                    .message-content {
                        max-width: 75%;
                        min-width: 120px;
                        flex: 0 1 auto;
                        padding: 14px 18px;
                        border-radius: 20px;
                        line-height: 1.7;
                        font-size: 15px;
                        word-wrap: break-word;
                        overflow-wrap: break-word;
                        word-break: break-word;
                        white-space: normal;
                        display: inline-block;
                        width: auto;
                        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
                        position: relative;
                        transition: transform 0.2s ease, box-shadow 0.2s ease;
                    }
                    .message-content:hover {
                        transform: translateY(-2px);
                        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
                    }
                    .message.user .message-content {
                        background: linear-gradient(135deg, #10a37f 0%, #0d8f6e 100%);
                        color: #ffffff;
                        border: none;
                        border-bottom-right-radius: 6px;
                        margin-left: auto;
                        box-shadow: 0 4px 12px rgba(16, 163, 127, 0.3);
                    }
                    .message.ai .message-content {
                        background: #ffffff;
                        color: #1f2937;
                        border: 1px solid #e5e7eb;
                        border-bottom-left-radius: 6px;
                        margin-right: auto;
                    }
                    .message-content ul {
                        margin: 12px 0;
                        padding-left: 25px;
                    }
                    .message-content li {
                        margin: 8px 0;
                    }
                    .message-content h3 {
                        margin: 16px 0 8px 0;
                        font-size: 17px;
                        font-weight: 700;
                        color: inherit;
                    }
                    .message-content p {
                        margin: 10px 0;
                        word-wrap: break-word;
                        overflow-wrap: break-word;
                        word-break: break-word;
                        white-space: normal;
                        width: 100%;
                        max-width: 100%;
                    }
                    .message-content strong {
                        font-weight: 700;
                        color: inherit;
                    }
                    .message.user .message-content strong {
                        color: rgba(255, 255, 255, 0.95);
                    }
                    .input-container {
                        position: sticky;
                        bottom: 0;
                        z-index: 10;
                        background: linear-gradient(to top, #ffffff 0%, rgba(255, 255, 255, 0.98) 100%);
                        padding: 20px 24px;
                        border-top: 1px solid #e5e7eb;
                        flex-shrink: 0;
                        backdrop-filter: blur(10px);
                    }
                    .input-wrapper {
                        display: flex;
                        align-items: flex-end;
                        background-color: #f9fafb;
                        border: 2px solid #e5e7eb;
                        border-radius: 16px;
                        padding: 10px 14px;
                        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
                        max-width: 100%;
                        transition: all 0.3s ease;
                    }
                    .input-wrapper:focus-within {
                        border-color: #10a37f;
                        box-shadow: 0 0 0 4px rgba(16, 163, 127, 0.15), 0 4px 12px rgba(0, 0, 0, 0.1);
                        background-color: #ffffff;
                        transform: translateY(-2px);
                    }
                    .input-field {
                        flex: 1;
                        border: none;
                        outline: none;
                        font-size: 15px;
                        padding: 10px;
                        background: transparent;
                        color: #1f2937;
                        resize: none;
                        font-family: inherit;
                        min-height: 28px;
                        max-height: 200px;
                        line-height: 1.5;
                    }
                    .input-field::placeholder {
                        color: #9ca3af;
                    }
                    .submit-btn {
                        background: linear-gradient(135deg, #10a37f 0%, #0d8f6e 100%);
                        color: white;
                        border: none;
                        border-radius: 10px;
                        padding: 10px 20px;
                        font-size: 14px;
                        font-weight: 600;
                        cursor: pointer;
                        transition: all 0.3s ease;
                        margin-left: 10px;
                        box-shadow: 0 2px 8px rgba(16, 163, 127, 0.3);
                        display: flex;
                        align-items: center;
                        gap: 6px;
                        position: relative;
                        overflow: hidden;
                    }
                    .submit-btn::after {
                        content: '→';
                        font-size: 18px;
                        transition: transform 0.3s ease;
                        margin-left: 4px;
                    }
                    .submit-btn:hover {
                        background: linear-gradient(135deg, #0d8f6e 0%, #0a7a5c 100%);
                        box-shadow: 0 4px 12px rgba(16, 163, 127, 0.4);
                        transform: translateY(-2px);
                    }
                    .submit-btn:hover::after {
                        transform: translateX(3px);
                    }
                    .submit-btn:active {
                        transform: translateY(0);
                        box-shadow: 0 2px 6px rgba(16, 163, 127, 0.3);
                    }
                    .submit-btn:disabled {
                        opacity: 0.6;
                        cursor: not-allowed;
                        transform: none;
                    }
                    .submit-btn:disabled::after {
                        display: none;
                    }
                    .thinking-container {
                        display: inline-flex;
                        align-items: center;
                        gap: 6px;
                        font-style: italic;
                        color: #6b7280;
                    }
                    .thinking-dot {
                        width: 10px;
                        height: 10px;
                        border-radius: 50%;
                        background: linear-gradient(135deg, #10a37f 0%, #0d8f6e 100%);
                        animation: thinking-pulse 1.4s ease-in-out infinite;
                        box-shadow: 0 2px 4px rgba(16, 163, 127, 0.3);
                    }
                    .thinking-dot:nth-child(1) {
                        animation-delay: 0s;
                    }
                    .thinking-dot:nth-child(2) {
                        animation-delay: 0.2s;
                    }
                    .thinking-dot:nth-child(3) {
                        animation-delay: 0.4s;
                    }
                    @keyframes thinking-pulse {
                        0%, 60%, 100% {
                            opacity: 0.4;
                            transform: scale(0.8);
                        }
                        30% {
                            opacity: 1;
                            transform: scale(1.2);
                        }
                    }
                    @media (max-width: 768px) {
                        .chat-container {
                            margin: 0;
                            height: 100vh;
                            border-radius: 0;
                        }
                        .chat-header {
                            border-radius: 0;
                            padding: 20px 16px;
                        }
                        .chat-header h1 {
                            font-size: 24px;
                        }
                        .chat-messages {
                            padding: 16px;
                        }
                        .message-content {
                            max-width: 85%;
                        }
                        .input-container {
                            padding: 16px;
                        }
                    }
                </style>
            `;
        };

        /**
         * Get current user's first name
         * @returns {string} User's first name
         */
        const getUserFirstName = () => {
            try {
                const currentUser = runtime.getCurrentUser();
                const employeeRecord = record.load({
                    type: record.Type.EMPLOYEE,
                    id: currentUser.id
                });
                return employeeRecord.getValue({
                    fieldId: 'firstname'
                }) || 'User';
            } catch (e) {
                // If employee record doesn't exist or error, try to get from user preferences
                try {
                    const currentUser = runtime.getCurrentUser();
                    return currentUser.name.split(' ')[0] || 'User';
                } catch (err) {
                    return 'User';
                }
            }
        };

        /**
         * Escape HTML to prevent XSS attacks
         * @param {string} text - Text to escape
         * @returns {string} Escaped HTML string
         */
        const escapeHtml = (text) => {
            if (!text) return '';
            const map = {
                '&': '&amp;',
                '<': '&lt;',
                '>': '&gt;',
                '"': '&quot;',
                "'": '&#039;'
            };
            return text.replace(/[&<>"']/g, (m) => map[m]);
        };

        /**
         * Generate SuiteMind chat interface HTML
         * @param {string} userMessage - User's message (optional)
         * @param {string} aiResponse - AI's formatted response (optional)
         * @param {string} userName - User's first name (optional)
         * @param {string} backendUrl - Backend script URL
         * @returns {string} HTML string for chat interface
         */
        const generateChatInterface = (userMessage, aiResponse, userName, backendUrl) => {
            let messagesHtml = '';
            // const currentUser = runtime.getCurrentUser();
            // const displayName = (currentUser.name ? currentUser.name.split(' ')[0] : 'User').replace(/\d+/g, '');
            if (!userMessage && !aiResponse) {
                // Initial welcome message
                messagesHtml = `
                    <div class="message ai" style="animation-delay: 0.1s;">
                        <div class="message-avatar">🤖</div>
                        <div class="message-content">
                            <p><strong>Hello, ${escapeHtml(userName)}! 👋</strong></p>
                            <p>I can help you with below NetSuite functionality. Ask me anything about it!</p>
                            <p><em>
                            <ul>
                            <li>Sandbox Refresh Checklist</li>
                            <li>Purge Framework Process</li>
                            <li>Custom List Management System</li>
                            </ul>
                           <!-- Note: I am currently limited to the capabilities of the following process. --></em></p>
                        </div>
                    </div>
                `;
            } else {
                // User message
                if (userMessage) {
                    const displayName = userName || 'User';
                    messagesHtml += `
                        <div class="message user">
                            <div class="message-content">${escapeHtml(userMessage)}</div>
                            <div class="message-avatar">
                                <span class="avatar-icon" style="color: #fff;">👤</span>
                                <span class="user-name">${escapeHtml(displayName)}</span>
                            </div>
                        </div>
                    `;
                }

                // AI response
                if (aiResponse) {
                    messagesHtml += `
                        <div class="message ai">
                            <div class="message-avatar">🤖</div>
                            <div class="message-content">${aiResponse}</div>
                        </div>
                    `;
                }
            }

            return `
                <div class="chat-container">
                    <div class="chat-header">
                        <h1>SuiteMind AI</h1>
                        <p class="tagline">SuiteMind - The AI Powered NetSuite Functionality Assistant</p>
                    </div>
                    <div class="chat-messages" id="chatMessages">
                        ${messagesHtml}
                    </div>
                    <div class="input-container">
                        <div class="input-wrapper">
                            <textarea id="custpage_textfield" class="input-field" rows="1" placeholder="Ask me..."></textarea>
                            <button type="button" id="sendBtn" class="submit-btn">Send</button>
                        </div>
                    </div>
                </div>
                <script>
                    const userName = ${JSON.stringify(userName || 'User')};
                    const backendUrl = ${JSON.stringify(backendUrl)};
                    const chatMessages = document.getElementById('chatMessages');
                    const textarea = document.getElementById('custpage_textfield');
                    const sendBtn = document.getElementById('sendBtn');
                    
                    // Auto-resize textarea
                    if (textarea) {
                        textarea.addEventListener('input', function() {
                            this.style.height = 'auto';
                            this.style.height = Math.min(this.scrollHeight, 200) + 'px';
                        });
                        
                        // Handle Enter key (Shift+Enter for new line)
                        textarea.addEventListener('keydown', function(e) {
                            if (e.key === 'Enter' && !e.shiftKey) {
                                e.preventDefault();
                                sendBtn.click();
                            }
                        });
                        
                        // Focus on textarea
                        textarea.focus();
                    }
                    
                    // Send message handler
                    sendBtn.addEventListener('click', async function() {
                        const userMessage = textarea.value.trim();
                        if (!userMessage) return;
                        
                        // Disable input while processing
                        textarea.disabled = true;
                        sendBtn.disabled = true;
                        sendBtn.innerHTML = 'Sending...';
                        
                        // Helper function to scroll to bottom smoothly
                        const scrollToBottom = () => {
                            // Use multiple methods to ensure scrolling works
                            requestAnimationFrame(() => {
                                chatMessages.scrollTop = chatMessages.scrollHeight;
                                // Double check with setTimeout as fallback
                                setTimeout(() => {
                                    chatMessages.scrollTop = chatMessages.scrollHeight;
                                }, 10);
                            });
                        };
                        
                        // Add user message to chat
                        const userMessageHtml = \`
                            <div class="message user" style="animation-delay: 0s;">
                                <div class="message-content">\${escapeHtml(userMessage)}</div>
                                <div class="message-avatar">
                                    <span class="avatar-icon">👤</span>
                                    <span class="user-name">\${escapeHtml(userName)}</span>
                                </div>
                            </div>
                        \`;
                        chatMessages.insertAdjacentHTML('beforeend', userMessageHtml);
                        scrollToBottom();
                        
                        // Clear input
                        textarea.value = '';
                        textarea.style.height = 'auto';
                        
                        // Add loading message with animation
                        const loadingHtml = \`
                            <div class="message ai" data-thinking="true" style="animation-delay: 0.1s;">
                                <div class="message-avatar">🤖</div>
                                <div class="message-content">
                                    <span class="thinking-container">
                                        Thinking
                                        <span class="thinking-dot"></span>
                                        <span class="thinking-dot"></span>
                                        <span class="thinking-dot"></span>
                                    </span>
                                </div>
                            </div>
                        \`;
                        chatMessages.insertAdjacentHTML('beforeend', loadingHtml);
                        scrollToBottom();
                        
                        try {
                            // Call backend
                            const response = await fetch(backendUrl + '&prompt=' + encodeURIComponent(userMessage));
                            const aiResponseText = await response.text();
                            
                            // Remove loading message
                            const loadingMsg = chatMessages.querySelector('[data-thinking="true"]');
                            if (loadingMsg) {
                                loadingMsg.remove();
                            }
                            
                            // Add AI response
                            const aiMessageHtml = \`
                                <div class="message ai" style="animation-delay: 0.2s;">
                                    <div class="message-avatar">🤖</div>
                                    <div class="message-content">\${aiResponseText}</div>
                                </div>
                            \`;
                            chatMessages.insertAdjacentHTML('beforeend', aiMessageHtml);
                            scrollToBottom();
                            
                        } catch (error) {
                            // Remove loading message
                            const loadingMsg = chatMessages.querySelector('[data-thinking="true"]');
                            if (loadingMsg) {
                                loadingMsg.remove();
                            }
                            
                            // Add error message
                            const errorHtml = \`
                                <div class="message ai" style="animation-delay: 0.2s;">
                                    <div class="message-avatar">⚠️</div>
                                    <div class="message-content" style="background: #fef2f2; border-color: #fecaca; color: #991b1b;">
                                        <strong>Error:</strong> Sorry, I encountered an error. Please try again.
                                    </div>
                                </div>
                            \`;
                            chatMessages.insertAdjacentHTML('beforeend', errorHtml);
                            scrollToBottom();
                        } finally {
                            // Re-enable input
                            textarea.disabled = false;
                            sendBtn.disabled = false;
                            sendBtn.innerHTML = 'Send';
                            textarea.focus();
                        }
                    });
                    
                    // Helper function to escape HTML
                    function escapeHtml(text) {
                        if (!text) return '';
                        const map = {
                            '&': '&amp;',
                            '<': '&lt;',
                            '>': '&gt;',
                            '"': '&quot;',
                            "'": '&#039;'
                        };
                        return text.replace(/[&<>"']/g, (m) => map[m]);
                    }
                </script>
            `;
        };

        return { onRequest }

    });
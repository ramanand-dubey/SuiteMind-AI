/**
 * @NApiVersion 2.1
 * @NScriptType Suitelet
 * @NModuleScope SameAccount
 */
/**
 * Version       Date           Author                 Description
 * 1.0           26-02-2026     Ramanand Dubey         Initial version - SuiteMind AI Prototype - chat interface 
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
         * Get SuiteMind CSS styles - Ultra Modern AI Theme
         * @returns {string} CSS styles as HTML string
         */
        const getSuiteMindStyles = () => {
            return `
                <style>
                    :root {
                        --primary: #10a37f;
                        --primary-hover: #0d8a6b;
                        --bg-main: #f3f4f6;
                        --chat-bg: #ffffff;
                        --text-main: #374151;
                        --text-muted: #6b7280;
                        --border-color: #e5e7eb;
                        --ai-bubble: #f9fafb;
                    }

                    * { box-sizing: border-box; }
                    
                    body {
                        background-color: var(--bg-main);
                        /* Subtle dot pattern for a technical feel */
                        background-image: radial-gradient(var(--border-color) 1px, transparent 1px);
                        background-size: 20px 20px;
                        font-family: 'Inter', -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
                        margin: 0;
                        padding: 0;
                        color: var(--text-main);
                    }

                    .chat-container {
                        max-width: 900px;
                        margin: 30px auto;
                        background: var(--chat-bg);
                        height: 85vh;
                        display: flex;
                        flex-direction: column;
                        border-radius: 16px;
                        border: 1px solid var(--border-color);
                        box-shadow: 0 20px 40px -10px rgba(0, 0, 0, 0.08);
                        overflow: hidden;
                    }

                    /* Header */
                    .chat-header {
                        padding: 16px 24px;
                        background: #ffffff;
                        border-bottom: 1px solid var(--border-color);
                        display: flex;
                        justify-content: space-between;
                        align-items: center;
                        z-index: 10;
                    }

                    .header-titles h1 {
                        margin: 0;
                        font-size: 18px;
                        font-weight: 700;
                        color: #111827;
                        display: flex;
                        align-items: center;
                        gap: 8px;
                    }

                    .header-titles .tagline {
                        margin: 4px 0 0 0;
                        font-size: 12px;
                        color: var(--text-muted);
                    }

                    .action-btn {
                        background: transparent;
                        border: 1px solid var(--border-color);
                        color: var(--text-muted);
                        padding: 6px 12px;
                        border-radius: 6px;
                        font-size: 13px;
                        cursor: pointer;
                        display: flex;
                        align-items: center;
                        gap: 6px;
                        transition: all 0.2s;
                    }
                    
                    .action-btn:hover {
                        background: #f3f4f6;
                        color: #ef4444;
                        border-color: #ef4444;
                    }

                    /* Messages Area */
                    .chat-messages {
                        flex: 1;
                        overflow-y: auto;
                        padding: 24px;
                        display: flex;
                        flex-direction: column;
                        gap: 24px;
                        scroll-behavior: smooth;
                    }

                    .message {
                        display: flex;
                        align-items: flex-start;
                        gap: 16px;
                        animation: slideUp 0.3s ease-out forwards;
                        opacity: 0;
                        transform: translateY(10px);
                    }

                    @keyframes slideUp {
                        to { opacity: 1; transform: translateY(0); }
                    }

                    .message-avatar {
                        width: 32px;
                        height: 32px;
                        border-radius: 8px;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        flex-shrink: 0;
                    }

                    .message.ai .message-avatar {
                        background: #10a37f;
                        color: white;
                    }

                    .message.user .message-avatar {
                        background: #4b5563;
                        color: white;
                    }

                    .message-content {
                        flex: 1;
                        max-width: 85%;
                        font-size: 15px;
                        line-height: 1.6;
                        color: var(--text-main);
                        padding-top: 4px; /* Align text with avatar */
                    }

                    .message-content p { margin: 0 0 12px 0; }
                    .message-content p:last-child { margin-bottom: 0; }
                    .message-content ul { margin: 0 0 12px 0; padding-left: 20px; }

                    /* Input Area */
                    .input-container {
                        padding: 20px 24px;
                        background: linear-gradient(180deg, rgba(255,255,255,0) 0%, #ffffff 20%);
                    }

                    .input-wrapper {
                        background: #ffffff;
                        border: 1px solid var(--border-color);
                        border-radius: 12px;
                        padding: 8px 12px;
                        display: flex;
                        align-items: flex-end;
                        box-shadow: 0 4px 15px rgba(0, 0, 0, 0.05);
                        transition: border-color 0.2s, box-shadow 0.2s;
                    }

                    .input-wrapper:focus-within {
                        border-color: var(--primary);
                        box-shadow: 0 4px 15px rgba(16, 163, 127, 0.1);
                    }

                    .input-field {
                        flex: 1;
                        border: none;
                        outline: none;
                        padding: 8px;
                        font-size: 15px;
                        color: var(--text-main);
                        resize: none;
                        background: transparent;
                        max-height: 150px;
                        font-family: inherit;
                    }

                    .submit-btn {
                        background: var(--primary);
                        color: white;
                        border: none;
                        border-radius: 8px;
                        width: 36px;
                        height: 36px;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        cursor: pointer;
                        transition: background 0.2s;
                        margin-left: 8px;
                        margin-bottom: 2px;
                    }

                    .submit-btn:hover { background: var(--primary-hover); }
                    .submit-btn:disabled { background: #d1d5db; cursor: not-allowed; }

                    /* Thinking Dots */
                    .thinking-container {
                        display: inline-flex;
                        gap: 4px;
                        padding: 8px 0;
                    }
                    .thinking-dot {
                        width: 6px;
                        height: 6px;
                        background: #9ca3af;
                        border-radius: 50%;
                        animation: bounce 1.4s infinite ease-in-out both;
                    }
                    .thinking-dot:nth-child(1) { animation-delay: -0.32s; }
                    .thinking-dot:nth-child(2) { animation-delay: -0.16s; }

                    @keyframes bounce {
                        0%, 80%, 100% { transform: scale(0); }
                        40% { transform: scale(1); }
                    }

                    @media (max-width: 768px) {
                        .chat-container { margin: 0; height: 100vh; border-radius: 0; border: none; }
                        .message-content { max-width: 100%; }
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
            // SVG Icons
            const aiIcon = `<svg stroke="currentColor" fill="none" stroke-width="2" viewBox="0 0 24 24" height="20" width="20" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path></svg>`;
            const userIcon = `<svg stroke="currentColor" fill="none" stroke-width="2" viewBox="0 0 24 24" height="20" width="20" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path></svg>`;
            const sendIcon = `<svg stroke="currentColor" fill="none" stroke-width="2" viewBox="0 0 24 24" height="18" width="18" xmlns="http://www.w3.org/2000/svg"><line x1="22" y1="2" x2="11" y2="13"></line><polygon points="22 2 15 22 11 13 2 9 22 2"></polygon></svg>`;
            const trashIcon = `<svg stroke="currentColor" fill="none" stroke-width="2" viewBox="0 0 24 24" height="14" width="14" xmlns="http://www.w3.org/2000/svg"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>`;

            const initialMessageHtml = `
                <div class="message ai">
                    <div class="message-avatar">${aiIcon}</div>
                    <div class="message-content">
                        <p><strong>Hello, ${escapeHtml(userName)}! 👋</strong></p>
                        <p>I am SuiteMind, your AI assistant for NetSuite functionality.</p>
                        <p><em>Currently, I can assist you with:</em></p>
                        <ul>
                            <li>Sandbox Refresh Checklists</li>
                            <li>Purge Frameworks</li>
                            <li>Custom List Management Systems</li>
                        </ul>
                        <p>How can I help you today?</p>
                    </div>
                </div>
            `;

            return `
                <div class="chat-container">
                    <div class="chat-header">
                        <div class="header-titles">
                            <h1>${aiIcon} SuiteMind AI</h1>
                            <p class="tagline">Enterprise NetSuite Assistant</p>
                        </div>
                        <button id="clearChatBtn" class="action-btn" title="Clear conversation">
                            ${trashIcon} Clear Chat
                        </button>
                    </div>
                    
                    <div class="chat-messages" id="chatMessages">
                        ${initialMessageHtml}
                    </div>
                    
                    <div class="input-container">
                        <div class="input-wrapper">
                            <textarea id="custpage_textfield" class="input-field" rows="1" placeholder="Message SuiteMind..."></textarea>
                            <button type="button" id="sendBtn" class="submit-btn" title="Send message">
                                ${sendIcon}
                            </button>
                        </div>
                    </div>
                </div>
                
                <script>
                    const userName = ${JSON.stringify(userName || 'User')};
                    const backendUrl = ${JSON.stringify(backendUrl)};
                    const chatMessages = document.getElementById('chatMessages');
                    const textarea = document.getElementById('custpage_textfield');
                    const sendBtn = document.getElementById('sendBtn');
                    const clearChatBtn = document.getElementById('clearChatBtn');
                    
                    // Store the initial message to restore on clear
                    const initialMessage = chatMessages.innerHTML;
                    
                    // Clear Chat functionality
                    clearChatBtn.addEventListener('click', () => {
                        chatMessages.innerHTML = initialMessage;
                        textarea.focus();
                    });

                    // Auto-resize textarea
                    if (textarea) {
                        textarea.addEventListener('input', function() {
                            this.style.height = 'auto';
                            this.style.height = Math.min(this.scrollHeight, 150) + 'px';
                            // Enable/disable send button based on input
                            sendBtn.disabled = this.value.trim() === '';
                        });
                        
                        // Handle Enter key (Shift+Enter for new line)
                        textarea.addEventListener('keydown', function(e) {
                            if (e.key === 'Enter' && !e.shiftKey) {
                                e.preventDefault();
                                if (this.value.trim() !== '') {
                                    sendBtn.click();
                                }
                            }
                        });
                        
                        textarea.focus();
                        sendBtn.disabled = true; // Disabled initially
                    }
                    
                    // Send message handler
                    sendBtn.addEventListener('click', async function() {
                        const userMessage = textarea.value.trim();
                        if (!userMessage) return;
                        
                        // Disable inputs
                        textarea.disabled = true;
                        sendBtn.disabled = true;
                        
                        const scrollToBottom = () => {
                            setTimeout(() => {
                                chatMessages.scrollTop = chatMessages.scrollHeight;
                            }, 50);
                        };
                        
                        // Add User Message
                        const userMessageHtml = \`
                            <div class="message user">
                                <div class="message-avatar">${userIcon.replace(/"/g, '&quot;')}</div>
                                <div class="message-content"><p>\${escapeHtml(userMessage).replace(/\\n/g, '<br>')}</p></div>
                            </div>
                        \`;
                        chatMessages.insertAdjacentHTML('beforeend', userMessageHtml);
                        
                        // Reset input
                        textarea.value = '';
                        textarea.style.height = 'auto';
                        scrollToBottom();
                        
                        // Add Loading Dots
                        const loadingHtml = \`
                            <div class="message ai" data-thinking="true">
                                <div class="message-avatar">${aiIcon.replace(/"/g, '&quot;')}</div>
                                <div class="message-content">
                                    <span class="thinking-container">
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
                            const response = await fetch(backendUrl + '&prompt=' + encodeURIComponent(userMessage));
                            const aiResponseText = await response.text();
                            
                            // Remove Loading
                            const loadingMsg = chatMessages.querySelector('[data-thinking="true"]');
                            if (loadingMsg) loadingMsg.remove();
                            
                            // Add AI Response
                            const aiMessageHtml = \`
                                <div class="message ai">
                                    <div class="message-avatar">${aiIcon.replace(/"/g, '&quot;')}</div>
                                    <div class="message-content">\${aiResponseText}</div>
                                </div>
                            \`;
                            chatMessages.insertAdjacentHTML('beforeend', aiMessageHtml);
                            
                        } catch (error) {
                            const loadingMsg = chatMessages.querySelector('[data-thinking="true"]');
                            if (loadingMsg) loadingMsg.remove();
                            
                            const errorHtml = \`
                                <div class="message ai">
                                    <div class="message-avatar" style="background:#ef4444;">!</div>
                                    <div class="message-content" style="color:#ef4444;">
                                        <p><strong>Error:</strong> Failed to connect to SuiteMind backend. Please try again.</p>
                                    </div>
                                </div>
                            \`;
                            chatMessages.insertAdjacentHTML('beforeend', errorHtml);
                        } finally {
                            textarea.disabled = false;
                            textarea.focus();
                            scrollToBottom();
                        }
                    });
                    
                    function escapeHtml(text) {
                        if (!text) return '';
                        const map = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#039;' };
                        return text.replace(/[&<>"']/g, (m) => map[m]);
                    }
                </script>
            `;
        };

        return { onRequest }

    });
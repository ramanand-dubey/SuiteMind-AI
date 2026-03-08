/**
 * @NApiVersion 2.1
 * @NScriptType Suitelet
 * @NModuleScope SameAccount
 */
/**
 * Version       Date           Author                 Description
 * 1.0           27-02-2026     Ramanand Dubey         Initial version - SuiteMind AI Prototype - Backend pdf file processing.
 */
define(['N/llm', './Lib/JG_Lib_SuiteMindAI_Helper'],
    /**
     * @param {llm} llm
     * @param {helper} helper
     */
    (llm, helper) => {
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

            const userPrompt = request.parameters.prompt;
            log.debug("userPrompt: " + userPrompt);
            if (!userPrompt) {
                response.write('Prompt required.');
                return;
            }

            try {
                // Get the data source
                const dataSource = helper.getDataSource();

                const llmResponse = llm.generateText({
                    preamble: helper.ENUMS.AI_INSTRUCTIONS,
                    prompt: userPrompt,
                    documents:dataSource,
                    modelFamily: llm.ModelFamily.COHERE_COMMAND,
                    modelParameters: {
                        maxTokens: 1000,
                        temperature: 0.2,
                        topK: 3,
                        topP: 0.7,
                        frequencyPenalty: 0.4,
                        presencePenalty: 0
                    }
                });
                // log.debug("llmResponse: ", llmResponse.text);

                // Format the response
                const formattedResponse = formatResponse(llmResponse.text);
                // log.debug("formattedResponse: " + formattedResponse);

                response.write(formattedResponse);

            } catch (error) {
                log.error("LLM Processing Error", error);
                response.write('<p>Sorry, I encountered an error processing your request. Please try again.</p>');
            }
        };

        /**
         * Format the LLM response for better readability
         * @param {string} text - Raw text response from LLM
         * @returns {string} Formatted HTML string
         */
        const formatResponse = (text) => {
            if (!text) return '<p>No response generated.</p>';

            // Split text into lines
            const lines = text.split('\n');
            let html = '';
            let inList = false;

            for (let i = 0; i < lines.length; i++) {
                const line = lines[i].trim();

                if (!line) {
                    if (inList) {
                        html += '</ul>';
                        inList = false;
                    }
                    // Add spacing between paragraphs
                    if (i < lines.length - 1 && lines[i + 1].trim()) {
                        html += '<br>';
                    }
                    continue;
                }

                // Check if line is a bullet point
                if (line.startsWith('- ')) {
                    if (!inList) {
                        html += '<ul>';
                        inList = true;
                    }
                    const content = line.substring(2);
                    // Convert **bold** to <strong>bold</strong> within list items
                    const formattedContent = content.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
                    html += '<li>' + formattedContent + '</li>';
                } else {
                    // Close list if we were in one
                    if (inList) {
                        html += '</ul>';
                        inList = false;
                    }

                    // Check if line is a header (ends with : and contains **)
                    if (line.endsWith(':') && line.includes('**')) {
                        const headerText = line.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>').replace(':', '');
                        html += '<h3>' + headerText + '</h3>';
                    } else {
                        // Regular text - convert **bold** and add paragraph styling
                        const formattedLine = line.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
                        html += '<p>' + formattedLine + '</p>';
                    }
                }
            }

            // Close any open list
            if (inList) {
                html += '</ul>';
            }

            return html || '<p>' + escapeHtml(text) + '</p>';
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

        return {
            onRequest: onRequest
        };
    }
);
/**
 * @NApiVersion 2.1
 */
/**
 * Version       Date           Author                 Description
 * 1.0           25-02-2026     Ramanand Dubey         Initial version - SuiteMind AI Helper Lirbary
 */
define(['N/runtime', 'N/documentCapture','N/file'],
    /**
 * @param{runtime} runtime
 * @param{documentCapture} documentCapture 
 * @param{file} file 
 */
    (runtime, documentCapture, file) => {

        const ENUMS = {
            ADMIN: {
                PARAM_ADMIN_SCRIPT: 'customscript_sl_suitemind_ai_admin',
                PARAM_ADMIN_DEPLOY: 'customdeploy_sl_suitemind_ai_admin',
                DEFAULT_ADMIN_SCRIPT: 'customscript_sl_suitemind_ai_admin',
                DEFAULT_ADMIN_DEPLOY: 'customdeploy_sl_suitemind_ai_admin',
            },
            CHAT: {
                PARAM_CHAT_SCRIPT: 'customscript_sl_suitemind_ai',
                PARAM_CHAT_DEPLOY: 'customdeploy_sl_suitemind_ai',
                DEFAULT_CHAT_SCRIPT: 'customscript_sl_suitemind_ai',
                DEFAULT_CHAT_DEPLOY: 'customdeploy_sl_suitemind_ai',
            },
            AI_INSTRUCTIONS: "You are an expert NetSuite functionality assistant with a friendly, conversational tone. Your role is to analyze the provided document and answer user questions accurately based solely on the document content. When engaging in casual conversation, be warm, approachable, and helpful while maintaining professionalism. For NetSuite-related questions, provide clear, well-structured responses that are easy to understand. Use proper formatting with paragraphs, bullet points, and headers when appropriate. If the document does not contain relevant information to answer the question, clearly state that the information is not available in your knowledge base, but offer to help with other questions. Always prioritize accuracy and relevance in your responses, and feel free to engage naturally in casual conversation when appropriate."


        }
        const getDataSource = () => {

            // Functionality-01 : Sandbox Refresh Checklist
            const sbRefreshDoc = file.load({
                id: "117959"
            });
            const extractedData_sbRefreshDoc = documentCapture.documentToText({
                file: sbRefreshDoc,
            });
            // Functionality-02 : Purge Framework
            const purgeDoc = file.load({
                id: "117957"
            });
            const extractedData_purgeDoc = documentCapture.documentToText({
                file: purgeDoc,
            });
            // Functionality-03 : Custom List Management System
            const clmsDoc = file.load({
                id: "117968"
            });
            const extractedData_clmsDoc = documentCapture.documentToText({
                file: clmsDoc,
            });

            let dataSource = [
                {
                    id: "117959",
                    data: extractedData_sbRefreshDoc
                },
                {
                    id: "117957",
                    data: extractedData_purgeDoc
                },
                {
                    id: "117968",
                    data: extractedData_clmsDoc
                }
            ]

            return dataSource;

        }

        return {
            ENUMS: ENUMS,
            getDataSource: getDataSource

        }

    });

/**
 * @NApiVersion 2.1
 * @NScriptType Suitelet
 * @NModuleScope SameAccount
 *
 * @description SuiteMind AI Home Page – landing UI for Admin (upload PDF to knowledge base)
 * and User (chat with AI for NetSuite functionality).
 */

/**
 * Version       Date           Author                 Description
 * 1.0           March,2026     Ramanand Dubey         Initial version - SuiteMind AI Home Page
 */

define(['N/runtime', 'N/log', 'N/url', './Lib/JG_Lib_SuiteMindAI_Helper'],
    /**
     * @param {runtime} runtime
     * @param {log} log
     * @param {url} url
     * @param {helper} helper 
     */
    (runtime, log, url, helper) => {

        /**
         * Suitelet entry point. Renders the home page with Admin and User options.
         * @param {Object} scriptContext
         * @param {ServerRequest} scriptContext.request
         * @param {ServerResponse} scriptContext.response
         */
        function onRequest(scriptContext) {
            const { response } = scriptContext;

            const adminUrl = resolveSuiteletUrl(
                helper.ENUMS.ADMIN.PARAM_ADMIN_SCRIPT,
                helper.ENUMS.ADMIN.PARAM_ADMIN_DEPLOY,
                helper.ENUMS.ADMIN.DEFAULT_ADMIN_SCRIPT,
                helper.ENUMS.ADMIN.DEFAULT_ADMIN_DEPLOY
            );
            const chatUrl = resolveSuiteletUrl(
                helper.ENUMS.CHAT.PARAM_CHAT_SCRIPT,
                helper.ENUMS.CHAT.PARAM_CHAT_DEPLOY,
                helper.ENUMS.CHAT.DEFAULT_CHAT_SCRIPT,
                helper.ENUMS.CHAT.DEFAULT_CHAT_DEPLOY
            );

            const html = getHomePageHtml(adminUrl, chatUrl);
            response.write(html);
        }

        /**
         * Resolve full URL for a Suitelet from script parameters (with fallback defaults).
         * @param {string} scriptParamId - Script parameter key for script ID
         * @param {string} deployParamId - Script parameter key for deployment ID
         * @param {string} defaultScriptId - Default script ID if param not set
         * @param {string} defaultDeployId - Default deployment ID if param not set
         * @returns {string} Full URL or '#' if resolution fails
         */
        function resolveSuiteletUrl(scriptParamId, deployParamId, defaultScriptId, defaultDeployId) {
            try {
                const script = runtime.getCurrentScript();
                let scriptId = script.getParameter({ name: scriptParamId });
                let deploymentId = script.getParameter({ name: deployParamId });

                if (!scriptId && defaultScriptId) scriptId = defaultScriptId;
                if (!deploymentId && defaultDeployId) deploymentId = defaultDeployId;

                if (!scriptId || !deploymentId) {
                    log.debug('Home resolveSuiteletUrl', 'Missing script/deploy ID');
                    return '#';
                }

                const path = url.resolveScript({
                    scriptId,
                    deploymentId,
                });
                const domain = url.resolveDomain({
                    hostType: url.HostType.APPLICATION,
                    accountId: runtime.accountId,
                });

                return `https://${domain}${path}`;
            } catch (e) {
                log.debug('Home resolveSuiteletUrl', e.message);
                return '#';
            }
        }

        /**
         * Escape HTML to prevent XSS.
         * @param {string} text
         * @returns {string}
         */
        function escapeHtml(text) {
            if (!text) return '';
            const map = {
                '&': '&amp;',
                '<': '&lt;',
                '>': '&gt;',
                '"': '&quot;',
                "'": '&#039;',
            };
            return String(text).replace(/[&<>"']/g, (m) => map[m]);
        }

        /**
         * Build the Admin card HTML.
         * @param {string} adminHref - URL for Admin Upload
         * @param {boolean} adminDisabled - Whether the Admin link is disabled
         * @returns {string}
         */
        function getAdminCardHtml(adminHref, adminDisabled) {
            const disabledClass = adminDisabled ? ' home-card--disabled' : '';
            const linkAttrs = adminDisabled
                ? ' onclick="return false;" title="Configure Admin script and deployment IDs in the Home Suitelet parameters."'
                : ' target="_blank" rel="noopener noreferrer"';

            return `<a href="${escapeHtml(adminHref)}" class="home-card home-card--admin${disabledClass}"${linkAttrs}>
              <div class="home-card-icon" aria-hidden="true">📄</div>
              <h2 class="home-card-title">Admin</h2>
              <p class="home-card-desc">Enhance the knowledge base by uploading PDF documents. Uploaded files are used to improve AI responses.</p>
              <span class="home-card-cta">Go to Upload →</span>
            </a>`;
        }

        /**
         * Build the User card HTML.
         * @param {string} chatHref - URL for Chat
         * @param {boolean} chatDisabled - Whether the Chat link is disabled
         * @returns {string}
         */
        function getUserCardHtml(chatHref, chatDisabled) {
            const disabledClass = chatDisabled ? ' home-card--disabled' : '';
            const linkAttrs = chatDisabled
                ? ' onclick="return false;" title="Configure Chat script and deployment IDs in the Home Suitelet parameters."'
                : ' target="_blank" rel="noopener noreferrer"';

            return `<a href="${escapeHtml(chatHref)}" class="home-card home-card--user${disabledClass}"${linkAttrs}>
              <div class="home-card-icon" aria-hidden="true">💬</div>
              <h2 class="home-card-title">User</h2>
              <p class="home-card-desc">Chat with AI to get understanding about NetSuite functionality. Ask questions and get answers from the knowledge base.</p>
              <span class="home-card-cta">Try SuiteMind AI →</span>
            </a>`;
        }

        function getHackathonDashboard(dashboardHref) {
            return `<a href="${escapeHtml(dashboardHref)}" class="home-card" target="_blank">
                    <div class="home-card-icon" aria-hidden="true">📊</div>
                    <h2 class="home-card-title">Dashboard</h2>
                    <p class="home-card-desc">Visualize workflows and see real-time AI impact analysis of SuiteMind AI Processes.</p>
                    <span class="home-card-cta" style="background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%); color: white;">View Dashboard →</span>
                    </a>`;
        }

        /**
         * Build the home page HTML with two cards: Admin (upload) and User (chat).
         * @param {string} adminUrl - URL to Admin Upload Suitelet
         * @param {string} chatUrl - URL to Chat Suitelet
         * @returns {string}
         */
        function getHomePageHtml(adminUrl, chatUrl) {
            const adminHref = (adminUrl && adminUrl !== '#') ? adminUrl : '#';
            const chatHref = (chatUrl && chatUrl !== '#') ? chatUrl : '#';
            const adminDisabled = adminHref === '#';
            const chatDisabled = chatHref === '#';
            const dashboardHref = `https://tstdrv2146048.app.netsuite.com/app/site/hosting/scriptlet.nl?script=634&deploy=1`

            const isAdmin = (runtime.getCurrentUser().role === 3); // Role 3 is Administrator
            
            let cardsHtml = getUserCardHtml(chatHref, chatDisabled);
            if (isAdmin) {
                cardsHtml = `${getAdminCardHtml(adminHref, adminDisabled)}
                  ${getUserCardHtml(chatHref, chatDisabled)}
                  ${getHackathonDashboard(dashboardHref)}`;
            }

            return `<!DOCTYPE html><html lang="en">
            <head>
              <meta charset="UTF-8">
              <meta name="viewport" content="width=device-width, initial-scale=1">
              <title>SuiteMind AI – Home</title>
              ${getHomeStyles()}
            </head>
            <body>
              <div class="home-container">
                <header class="home-header">
                  <h1 class="home-title">SuiteMind AI</h1>
                  <p class="home-tagline">SuiteMind - The AI Powered NetSuite Functionality Assistant</p>
                </header>
                <main class="home-cards">
                  ${cardsHtml}
                </main>
                <p class="home-hint">Select your role to continue</p>
                <footer class="home-footer">
                  <p class="home-footer-copy">© 2026 SuiteMind AI. All rights reserved.</p>
                  <p class="home-footer-dev">Developed by Ramanand Dubey</p>
                </footer>
              </div>
            </body></html>`;
        }

        /**
         * CSS for the home page.
         * @returns {string}
         */
        function getHomeStyles() {
            return `<style>
                * { box-sizing: border-box; }
                body { margin: 0; padding: 0; min-height: 100vh; font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); background-attachment: fixed; }
                .home-container { max-width: 1200px; margin: 0 auto; padding: 48px 24px 32px; min-height: 100vh; display: flex; flex-direction: column; align-items: center; }
                .home-header { text-align: center; margin-bottom: 48px; }
                .home-title { margin: 0; font-size: 2.5rem; font-weight: 700; color: #ffffff; text-shadow: 0 2px 8px rgba(0,0,0,0.2); letter-spacing: -0.5px; }
                .home-tagline { margin: 10px 0 0 0;font-size: 14px;font-weight: 400;color: rgba(255, 255, 255, 0.9);font-style: italic;text-shadow: 0 1px 2px rgba(0, 0, 0, 0.1); }
                .home-cards { display: grid; grid-template-columns: repeat(3, 1fr); gap: 28px; width: 100%; max-width: 1080px; }
                .home-card { display: flex; flex-direction: column; background: #ffffff; border-radius: 16px; padding: 32px 28px; text-decoration: none; color: inherit; box-shadow: 0 20px 60px rgba(0,0,0,0.25); border: 1px solid rgba(255,255,255,0.2); transition: transform 0.25s ease, box-shadow 0.25s ease; text-align: left; cursor: pointer; height: 100%; }
                .home-card:hover:not(.home-card--disabled) { transform: translateY(-4px); box-shadow: 0 24px 48px rgba(0,0,0,0.3); }
                .home-card--disabled { opacity: 0.75; cursor: not-allowed; }
                .home-card-icon { font-size: 2.5rem; margin-bottom: 16px; line-height: 1; }
                .home-card-title { margin: 0 0 12px 0; font-size: 1.5rem; font-weight: 700; color: #1f2937; }
                .home-card-desc { margin: 0 0 24px 0; font-size: 0.9375rem; line-height: 1.6; color: #4b5563; flex: 1; }
                .home-card-cta { align-self: flex-start; display: inline-flex; align-items: center; gap: 8px; padding: 12px 20px; font-size: 0.9375rem; font-weight: 600; border-radius: 12px; transition: transform 0.2s ease, box-shadow 0.2s ease; text-decoration: none; }
                .home-card--admin .home-card-cta { color: #fff; background: linear-gradient(135deg, #10b981 0%, #059669 100%); box-shadow: 0 4px 14px rgba(16,185,129,0.35); }
                .home-card--admin:not(.home-card--disabled):hover .home-card-cta { transform: translateY(-2px); box-shadow: 0 6px 20px rgba(16,185,129,0.45); }
                .home-card--user .home-card-cta { color: #fff; background: linear-gradient(135deg, #6366f1 0%, #4f46e5 100%); box-shadow: 0 4px 14px rgba(99,102,241,0.35); }
                .home-card--user:not(.home-card--disabled):hover .home-card-cta { transform: translateY(-2px); box-shadow: 0 6px 20px rgba(99,102,241,0.45); }
                .home-card--disabled .home-card-cta { opacity: 0.7; }
                .home-hint { margin-top: 28px; text-align: center; font-size: 1.0625rem; color: rgba(255,255,255,0.9); font-weight: 500; }
                .home-footer { margin-top: auto; padding-top: 48px; text-align: center; font-size: 0.75rem; color: rgba(255,255,255,0.65); font-weight: 400; }
                .home-footer p { margin: 0; line-height: 1.6; }
                .home-footer-copy { margin-bottom: 2px; }
                .home-footer-dev { font-size: 0.6875rem; color: rgba(255,255,255,0.5); }
                
                @media (max-width: 960px) { .home-cards { grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); } }
                @media (max-width: 640px) { .home-container { padding: 32px 16px 24px; } .home-title { font-size: 2rem; } .home-cards { gap: 20px; } .home-card { padding: 24px 20px; } }
            </style>`;
        }

        return { onRequest };
    });
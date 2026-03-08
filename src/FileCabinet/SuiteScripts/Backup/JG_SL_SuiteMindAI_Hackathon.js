/**
 * @NApiVersion 2.1
 * @NScriptType Suitelet
 * @NModuleScope SameAccount
 *
 * @description SuiteMind AI Process Intelligence Dashboard - Hackathon Prototype
 * Displays SuiteMind AI performance metrics, high-level architecture, and impact analysis.
 */

define(['N/runtime', 'N/log', 'N/url'],
    /**
     * @param {runtime} runtime
     * @param {log} log
     * @param {url} url
     */
    (runtime, log, url) => {

        function onRequest(scriptContext) {
            const { response } = scriptContext;
            const html = getDashboardHtml();
            response.write(html);
        }

        function getDashboardHtml() {
            return `<!DOCTYPE html>
            <html lang="en">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1">
                <title>SuiteMind AI – Process Intelligence</title>
                ${getStyles()}
            </head>
            <body>
                <div class="dashboard-page">
                    <div class="dashboard-wrap">
                        <header class="dashboard-header">
                            <h1>SuiteMind <span>Process Intelligence</span></h1>
                            <p class="tagline">Real-time workflow visualization and automated impact analysis</p>
                        </header>

                        <div class="dashboard-content">
                            <div class="section-title">Key Performance Indicators</div>
                            <div class="kpi-grid">
                                <div class="kpi-card">
                                    <h3>Trained Processes</h3>
                                    <div class="kpi-value">3</div>
                                    <div class="kpi-trend positive">PDFs in Knowledge Base</div>
                                </div>
                                <div class="kpi-card">
                                    <h3>Active Users</h3>
                                    <div class="kpi-value">12</div>
                                    <div class="kpi-trend positive">↑ 3 this week</div>
                                </div>
                                <div class="kpi-card">
                                    <h3>Avg. Daily Requests</h3>
                                    <div class="kpi-value">320</div>
                                    <div class="kpi-trend neutral">Queries processed</div>
                                </div>
                                <div class="kpi-card">
                                    <h3>Avg. Response Time</h3>
                                    <div class="kpi-value">1.8s</div>
                                    <div class="kpi-trend positive">Lightning Fast ⚡</div>
                                </div>
                                <div class="kpi-card alert-card">
                                    <h3>Training Time</h3>
                                    <div class="kpi-value">< 45s</div>
                                    <div class="kpi-trend negative">Per new process PDF</div>
                                </div>
                            </div>

                            <div class="dashboard-grid">
                                <section class="panel visualization-panel">
                                    <div class="panel-header">
                                        <h2>SuiteMind AI - Workflow Visualization</h2>
                                        <span class="badge">High-Level Flow</span>
                                    </div>
                                    <div class="panel-body">
                                        <div class="arch-diagram">
                                            
                                            <div class="arch-split">
                                                <div class="arch-col">
                                                    <div class="arch-label">Knowledge Ingestion</div>
                                                    <div class="arch-node ui-node">
                                                        <strong>Admin Portal</strong>
                                                        <small>Upload Process PDFs</small>
                                                    </div>
                                                    <div class="arch-arrow">↓</div>
                                                    <div class="arch-node db-node">
                                                        <strong>SuiteMind Knowledge Base</strong>
                                                        <small>Extracted & Processed Text</small>
                                                    </div>
                                                </div>

                                                <div class="arch-col">
                                                    <div class="arch-label">User Query Processing</div>
                                                    <div class="arch-node ui-node" style="background: #4f46e5; color: white; border-color: #4338ca;">
                                                        <strong>User Chat UI</strong>
                                                        <small style="color: #e0e7ff;">Ask NetSuite Questions</small>
                                                    </div>
                                                    <div class="arch-arrow">↓</div>
                                                    <div class="arch-node script-node">
                                                        <strong>Context Retrieval</strong>
                                                        <small>Match query to relevant docs</small>
                                                    </div>
                                                </div>
                                            </div>

                                            <div class="arch-converge">
                                                <div class="arch-arrow down-right">↘</div>
                                                <div class="arch-arrow down-left">↙</div>
                                            </div>
                                            
                                            <div class="arch-row">
                                                <div class="arch-node ext-node llm" style="max-width: 300px;">
                                                    <strong>NetSuite AI / LLM Engine</strong>
                                                    <small>Synthesizes context & generates answer</small>
                                                </div>
                                            </div>
                                            
                                            <div class="arch-row">
                                                <div class="arch-arrow">↓</div>
                                            </div>
                                            
                                            <div class="arch-row">
                                                <div class="arch-node ui-node feedback" style="max-width: 300px;">
                                                    <strong>Formatted AI Response</strong>
                                                    <small>Delivered seamlessly back to User</small>
                                                </div>
                                            </div>
                                            
                                        </div>
                                    </div>
                                </section>

                                <section class="panel impact-panel">
                                    <div class="panel-header">
                                        <h2>SuiteMind AI - Automated Impact Analysis</h2>
                                        <span class="badge live">Live Analysis</span>
                                    </div>
                                    <div class="panel-body">
                                        <div class="impact-feed">
                                            
                                            <div class="impact-item high-risk">
                                                <div class="impact-icon">🔄</div>
                                                <div class="impact-details">
                                                    <h4>System Alert: <span>Sandbox Refresh Checklist</span></h4>
                                                    <p class="impact-desc">Scheduled Production-to-Sandbox refresh initiated for account SB1.</p>
                                                    <div class="impact-assessment">
                                                        <strong>AI Assessment:</strong> High Impact. Post-refresh tasks outlined in the 'Sandbox Refresh Checklist' must be executed immediately to prevent outbound integration failures and email misfires.
                                                    </div>
                                                    <div class="impact-action">Recommended Action: Ask SuiteMind AI for the step-by-step Sandbox Refresh post-deployment tasks.</div>
                                                </div>
                                            </div>

                                            <div class="impact-item medium-risk">
                                                <div class="impact-icon">🗑️</div>
                                                <div class="impact-details">
                                                    <h4>Optimization Opportunity: <span>Purge Framework</span></h4>
                                                    <p class="impact-desc">Data volume in custom record 'Integration Logs' has exceeded 5 million rows.</p>
                                                    <div class="impact-assessment">
                                                        <strong>AI Assessment:</strong> Medium Impact. High data volume is degrading search performance. The 'Purge Framework' rules should be activated for this record type.
                                                    </div>
                                                    <div class="impact-action">Recommended Action: Ask SuiteMind AI: "How do I configure the Purge Framework for custom records?"</div>
                                                </div>
                                            </div>

                                        </div>
                                    </div>
                                </section>
                            </div>
                        </div>
                    </div>
                </div>
            </body>
            </html>`;
        }

        function getStyles() {
            return `<style>
                * { box-sizing: border-box; margin: 0; padding: 0; }
                body { 
                    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif; 
                    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); 
                    background-attachment: fixed;
                    color: #1f2937; 
                    line-height: 1.5; 
                    min-height: 100vh;
                }
                
                .dashboard-page { padding: 40px 20px; display: flex; justify-content: center; }
                
                .dashboard-wrap { 
                    background: #ffffff; 
                    border-radius: 24px; 
                    box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3); 
                    border: 1px solid rgba(255, 255, 255, 0.2); 
                    width: 100%; 
                    max-width: 1300px; 
                    overflow: hidden; 
                    display: flex; 
                    flex-direction: column;
                }

                /* Header */
                .dashboard-header { 
                    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); 
                    padding: 32px 24px; 
                    text-align: center; 
                    color: #ffffff; 
                }
                .dashboard-header h1 { margin: 0; font-size: 32px; font-weight: 800; letter-spacing: -0.5px; text-shadow: 0 2px 4px rgba(0, 0, 0, 0.2); }
                .dashboard-header h1 span { color: #e0e7ff; font-weight: 400; }
                .dashboard-header .tagline { margin: 10px 0 0 0; font-size: 15px; font-style: italic; color: rgba(255, 255, 255, 0.9); }

                .dashboard-content { padding: 32px; background: #f8f9fa; flex: 1; }
                .section-title { font-size: 20px; font-weight: 700; color: #374151; margin-bottom: 20px; }

                /* KPIs */
                .kpi-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(180px, 1fr)); gap: 20px; margin-bottom: 32px; }
                .kpi-card { background: #ffffff; padding: 20px; border-radius: 16px; box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05); border: 1px solid #e5e7eb; transition: transform 0.2s; }
                .kpi-card:hover { transform: translateY(-4px); box-shadow: 0 12px 20px rgba(0, 0, 0, 0.1); }
                .kpi-card h3 { font-size: 12px; font-weight: 700; color: #6b7280; text-transform: uppercase; letter-spacing: 0.05em; }
                .kpi-value { font-size: 28px; font-weight: 800; color: #111827; margin: 8px 0; }
                .kpi-trend { font-size: 13px; font-weight: 500; }
                .kpi-trend.positive { color: #10b981; }
                .kpi-trend.neutral { color: #6b7280; }
                .kpi-trend.negative { color: #8b5cf6; } 
                .alert-card { border-top: 4px solid #8b5cf6; }

                /* Main Grid */
                .dashboard-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 24px; }
                @media (max-width: 960px) { .dashboard-grid { grid-template-columns: 1fr; } }
                
                .panel { background: #ffffff; border-radius: 16px; box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05); border: 1px solid #e5e7eb; overflow: hidden; display: flex; flex-direction: column; }
                .panel-header { padding: 20px 24px; border-bottom: 1px solid #e5e7eb; display: flex; justify-content: space-between; align-items: center; }
                .panel-header h2 { font-size: 18px; font-weight: 700; color: #374151; }
                .badge { font-size: 12px; font-weight: 600; padding: 4px 10px; border-radius: 999px; background: #e0e7ff; color: #4f46e5; }
                
                /* Real-World "Live" Badge Styling */
                .badge.live { 
                    background-color: #ef4444; 
                    color: #ffffff; 
                    display: inline-flex;
                    align-items: center;
                    gap: 6px;
                    text-transform: uppercase;
                    letter-spacing: 0.05em;
                    box-shadow: 0 0 0 0 rgba(239, 68, 68, 0.7);
                    animation: livePulse 2s infinite; 
                }
                .badge.live::before {
                    content: '';
                    display: block;
                    width: 6px;
                    height: 6px;
                    border-radius: 50%;
                    background-color: #ffffff;
                }

                .panel-body { padding: 24px; flex: 1; overflow-y: auto; }

                /* Architecture Diagram CSS (High Level) */
                .arch-diagram { display: flex; flex-direction: column; align-items: center; width: 100%; padding: 10px 0; }
                .arch-row { display: flex; justify-content: center; width: 100%; z-index: 2; }
                .arch-split { display: flex; justify-content: space-around; gap: 20px; margin: 12px 0; width: 100%; max-width: 600px; }
                .arch-col { display: flex; flex-direction: column; align-items: center; width: 48%; }
                
                .arch-label { font-size: 13px; font-weight: 700; color: #4b5563; background: #f3f4f6; padding: 6px 14px; border-radius: 20px; text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 12px; text-align: center; width: 100%; }
                
                .arch-node { padding: 16px 20px; border-radius: 12px; font-size: 14px; font-weight: 600; text-align: center; width: 100%; max-width: 240px; box-shadow: 0 4px 6px rgba(0,0,0,0.05); background: #ffffff; border: 1px solid #d1d5db; color: #374151; line-height: 1.4; position: relative; transition: transform 0.2s; }
                .arch-node:hover { transform: translateY(-2px); box-shadow: 0 6px 12px rgba(0,0,0,0.1); }
                .arch-node strong { display: block; font-size: 15px; margin-bottom: 4px; }
                .arch-node small { font-weight: 400; font-size: 12px; opacity: 0.85; display: block; }
                
                /* Connecting Arrows */
                .arch-arrow { font-size: 20px; color: #9ca3af; margin: 8px 0; font-weight: bold; line-height: 1; z-index: 1;}
                .arch-converge { display: flex; justify-content: center; gap: 120px; width: 100%; max-width: 400px; }
                
                /* Specific Node Styling */
                .ui-node { background: #eff6ff; border-color: #bfdbfe; color: #1e3a8a; }
                .ui-node.feedback { background: #f0fdf4; border-color: #bbf7d0; color: #166534; }
                .db-node { background: #f8fafc; border: 2px solid #94a3b8; border-top-width: 8px; }
                .script-node { background: #fffbeb; border: 2px dashed #f59e0b; color: #b45309; }
                .ext-node.llm { background: #f0fdfa; border: 2px solid #5eead4; color: #0f766e; }

                /* Impact Feed */
                .impact-feed { display: flex; flex-direction: column; gap: 16px; }
                .impact-item { display: flex; gap: 16px; padding: 16px; border-radius: 12px; border: 1px solid #e5e7eb; background: #f9fafb; transition: transform 0.2s; }
                .impact-item:hover { transform: translateX(4px); }
                .impact-item.high-risk { border-left: 4px solid #ef4444; background: #fef2f2; }
                .impact-item.medium-risk { border-left: 4px solid #f59e0b; background: #fffbeb; }
                .impact-icon { font-size: 24px; }
                .impact-details h4 { font-size: 15px; color: #111827; margin-bottom: 4px; }
                .impact-details h4 span { font-family: monospace; color: #4b5563; font-weight: normal; font-size: 13px; }
                .impact-desc { font-size: 14px; color: #4b5563; margin-bottom: 12px; }
                .impact-assessment { background: rgba(255,255,255,0.7); padding: 12px; border-radius: 8px; font-size: 13px; color: #374151; margin-bottom: 12px; border: 1px dashed #cbd5e1; }
                .impact-action { font-size: 13px; font-weight: 600; color: #4f46e5; display: inline-flex; align-items: center; gap: 4px; }
                .impact-action::before { content: "💡"; }

                /* Live Pulsing Animation */
                @keyframes livePulse { 
                    0% { box-shadow: 0 0 0 0 rgba(239, 68, 68, 0.7); } 
                    70% { box-shadow: 0 0 0 6px rgba(239, 68, 68, 0); } 
                    100% { box-shadow: 0 0 0 0 rgba(239, 68, 68, 0); } 
                }
            </style>`;
        }

        return { onRequest };
    });
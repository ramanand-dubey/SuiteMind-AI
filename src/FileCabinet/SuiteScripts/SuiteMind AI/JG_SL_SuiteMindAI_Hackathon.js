/**
 * @NApiVersion 2.1
 * @NScriptType Suitelet
 * @NModuleScope SameAccount
 *
 * @description SuiteMind AI Process Intelligence Dashboard - Hackathon Prototype
 * Displays a full-scale SaaS dashboard with metrics, architecture, and impact analysis.
 */

/**
 * Version       Date           Author                 Description
 * 1.0           2026-02-14     Ramanand Dubey         Initial version - SuiteMind AI Home Page
 */

define(['N/runtime', 'N/log', 'N/url'],
    /**
     * @param {runtime} runtime
     * @param {log} log
     * @param {url} url
     */
    (runtime, log, url) => {

        const Acees_Control = `https://tstdrv2146048.app.netsuite.com/app/site/hosting/scriptlet.nl?script=627&deploy=1`;
        const AI_Chat = `https://tstdrv2146048.app.netsuite.com/app/site/hosting/scriptlet.nl?script=629&deploy=1`;
        const Knowledge_base = `https://tstdrv2146048.app.netsuite.com/app/site/hosting/scriptlet.nl?script=628&deploy=1`;

        function onRequest(scriptContext) {
            const { response } = scriptContext;
            let userObj = runtime.getCurrentUser();
            const html = getDashboardHtml(userObj);
            response.write(html);
        }

        function getDashboardHtml(userObj) {
            return `<!DOCTYPE html>
            <html lang="en">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1">
                <title>SuiteMind AI – Dashboard</title>
                ${getStyles()}
            </head>
            <body>
                <div class="app-layout">
                    <aside class="sidebar">
                        <div class="sidebar-logo">
                            <span class="logo-icon">🧠</span>
                            <span class="logo-text">SuiteMind AI</span>
                        </div>
                        <nav class="sidebar-nav">
                            <div class="nav-section">MAIN</div>
                            <a href="#" class="nav-item active"><span class="nav-icon">📊</span> Dashboard</a>
                            <a href="${AI_Chat}" class="nav-item"><span class="nav-icon">💬</span> AI Chat Interface</a>
                            
                            <div class="nav-section">ADMINISTRATION</div>
                            <a href="${Knowledge_base}" class="nav-item"><span class="nav-icon">📄</span> Knowledge Base</a>
                            <a href="${Acees_Control}" class="nav-item"><span class="nav-icon">🛡️</span> Access Control</a>
                        </nav>
                        <div class="sidebar-footer">
                            <div class="status-indicator">
                                <span class="status-dot"></span> System Online
                            </div>
                        </div>
                    </aside>

                    <div class="main-wrapper">
                        <header class="topbar">
                            <div class="topbar-search">
                                <span class="search-icon">🔍</span>
                                <input type="text" placeholder="Search analytics, documents, or queries...">
                            </div>
                            <div class="topbar-actions">
                                <button class="action-btn notification-btn">
                                    🔔<span class="badge-dot"></span>
                                </button>
                                <div class="user-profile">
                                    <div class="avatar">${userObj.name.split(' ').map(n => n.charAt(0)).filter(c => isNaN(c)).join('').toUpperCase()}</div>
                                    <div class="user-info">
                                        <span class="user-name">${userObj.name}</span>
                                        <span class="user-role">${userObj.roleId}</span>
                                    </div>
                                </div>
                            </div>
                        </header>

                        <main class="dashboard-content">
                            <div class="page-header">
                                <h1>Process Intelligence Dashboard</h1>
                                <p>Real-time workflow visualization and automated impact analysis</p>
                            </div>

                            <h2 class="section-title">Key Performance Indicators</h2>
                            <div class="kpi-grid">
                                <div class="kpi-card">
                                    <div class="kpi-header">Trained Processes</div>
                                    <div class="kpi-value">3</div>
                                    <div class="kpi-trend positive">PDFs in Knowledge Base</div>
                                </div>
                                <div class="kpi-card">
                                    <div class="kpi-header">Active Users</div>
                                    <div class="kpi-value">20</div>
                                    <div class="kpi-trend positive">↑ 10 this week</div>
                                </div>
                                <div class="kpi-card">
                                    <div class="kpi-header">Avg. Daily Requests</div>
                                    <div class="kpi-value">320</div>
                                    <div class="kpi-trend neutral">Queries processed</div>
                                </div>
                                <div class="kpi-card">
                                    <div class="kpi-header">Avg. Response Time</div>
                                    <div class="kpi-value">1.8s</div>
                                    <div class="kpi-trend positive">Lightning Fast ⚡</div>
                                </div>
                                <div class="kpi-card alert-card">
                                    <div class="kpi-header">Training Time</div>
                                    <div class="kpi-value">< 45s</div>
                                    <div class="kpi-trend negative">Per new process PDF</div>
                                </div>
                            </div>

                            <div class="dashboard-grid side-by-side-row">
                                <section class="panel visualization-panel">
                                    <div class="panel-header">
                                        <h2>SuiteMind AI - Workflow Visualization</h2>
                                        <span class="badge">System Map v1.0</span>
                                    </div>
                                    <div class="panel-body" style="display: flex; justify-content: center;">
                                        <div class="arch-diagram">
                                            <div class="arch-split">
                                                <div class="arch-col">
                                                    <div class="arch-label">Knowledge Ingestion</div>
                                                    <div class="arch-node ui-node"><strong>Admin Portal</strong><small>Upload Process PDFs</small></div>
                                                    <div class="arch-arrow">↓</div>
                                                    <div class="arch-node db-node"><strong>SuiteMind Knowledge Base</strong><small>Extracted & Processed Text</small></div>
                                                </div>
                                                <div class="arch-col">
                                                    <div class="arch-label">User Query Processing</div>
                                                    <div class="arch-node ui-node chat-theme"><strong>User Chat UI</strong><small>Ask NetSuite Questions</small></div>
                                                    <div class="arch-arrow">↓</div>
                                                    <div class="arch-node script-node"><strong>Context Retrieval</strong><small>Match query to relevant docs</small></div>
                                                </div>
                                            </div>
                                            <div class="arch-converge">
                                                <div class="arch-arrow down-right">↘</div>
                                                <div class="arch-arrow down-left">↙</div>
                                            </div>
                                            <div class="arch-row">
                                                <div class="arch-node ext-node llm"><strong>NetSuite AI / LLM Engine</strong><small>Synthesizes context & generates answer</small></div>
                                            </div>
                                            <div class="arch-row"><div class="arch-arrow">↓</div></div>
                                            <div class="arch-row">
                                                <div class="arch-node ui-node feedback"><strong>Formatted AI Response</strong><small>Delivered seamlessly back to User</small></div>
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
                                                        <strong>AI Assessment:</strong> High Impact. Post-refresh tasks outlined in the 'Sandbox Refresh Checklist' must be executed immediately to prevent outbound failures.
                                                    </div>
                                                    <div class="impact-action">Recommended Action: Ask SuiteMind AI for the step-by-step Sandbox Refresh tasks.</div>
                                                </div>
                                            </div>
                                            <div class="impact-item medium-risk">
                                                <div class="impact-icon">🗑️</div>
                                                <div class="impact-details">
                                                    <h4>Optimization Opportunity: <span>Purge Framework</span></h4>
                                                    <p class="impact-desc">Data volume in custom record 'Integration Logs' has exceeded 5 million rows.</p>
                                                    <div class="impact-assessment">
                                                        <strong>AI Assessment:</strong> Medium Impact. High data volume is degrading search performance. The 'Purge Framework' rules should be activated.
                                                    </div>
                                                    <div class="impact-action">Recommended Action: Ask SuiteMind AI: "How do I configure the Purge Framework?"</div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </section>
                            </div>

                            <div class="dashboard-grid single-row">
                                <section class="panel list-panel">
                                    <div class="panel-header">
                                        <h2>Recently Trained PDFs</h2>
                                        <a href="#" class="view-all">View All</a>
                                    </div>
                                    <div class="panel-body">
                                        <ul class="doc-list">
                                            <li>
                                                <div class="doc-icon">📄</div>
                                                <div class="doc-info">
                                                    <strong>Sandbox_Refresh_Checklist.pdf</strong>
                                                    <span>Trained 2 hours ago by S. Admin</span>
                                                </div>
                                                <div class="doc-status success">Active</div>
                                            </li>
                                            <li>
                                                <div class="doc-icon">📄</div>
                                                <div class="doc-info">
                                                    <strong>Purge Framework Process.pdf</strong>
                                                    <span>Trained yesterday by Integration Team</span>
                                                </div>
                                                <div class="doc-status success">Active</div>
                                            </li>
                                            <li>
                                                <div class="doc-icon">📄</div>
                                                <div class="doc-info">
                                                    <strong>Custom List Management.pdf</strong>
                                                    <span>Trained 3 days ago by S. Admin</span>
                                                </div>
                                                <div class="doc-status success">Active</div>
                                            </li>
                                            <li>
                                                <div class="doc-icon" style="filter: grayscale(1);">📄</div>
                                                <div class="doc-info">
                                                    <strong style="color: #9ca3af;">Legacy Approval Flow.pdf</strong>
                                                    <span>Archived</span>
                                                </div>
                                                <div class="doc-status archived">Archived</div>
                                            </li>
                                        </ul>
                                    </div>
                                </section>
                            </div>

                        </main>
                    </div>
                </div>
            </body>
            </html>`;
        }

        function getStyles() {
            return `<style>
                /* CSS Reset & Variables */
                * { box-sizing: border-box; margin: 0; padding: 0; }
                :root {
                    --primary: #667eea;
                    --primary-dark: #5a67d8;
                    --secondary: #764ba2;
                    --bg-app: #f1f5f9;
                    --bg-panel: #ffffff;
                    --text-main: #1e293b;
                    --text-muted: #64748b;
                    --border: #e2e8f0;
                    --success: #10b981;
                    --warning: #f59e0b;
                    --danger: #ef4444;
                    --sidebar-width: 260px;
                    --topbar-height: 70px;
                }
                body { 
                    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif; 
                    background-color: var(--bg-app);
                    color: var(--text-main); 
                    line-height: 1.5; 
                    overflow: hidden; 
                }
                
                /* Layout */
                .app-layout { display: flex; height: 100vh; width: 100vw; }
                
                /* Sidebar */
                .sidebar {
                    width: var(--sidebar-width);
                    background: linear-gradient(180deg, #1e1b4b 0%, #312e81 100%);
                    color: white;
                    display: flex;
                    flex-direction: column;
                    flex-shrink: 0;
                    box-shadow: 4px 0 15px rgba(0,0,0,0.1);
                    z-index: 20;
                }
                .sidebar-logo {
                    height: var(--topbar-height);
                    display: flex;
                    align-items: center;
                    padding: 0 24px;
                    font-size: 20px;
                    font-weight: 800;
                    border-bottom: 1px solid rgba(255,255,255,0.1);
                    letter-spacing: -0.5px;
                }
                .logo-icon { margin-right: 10px; font-size: 24px; }
                .logo-text { background: linear-gradient(135deg, #a5b4fc, #c7d2fe); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
                
                .sidebar-nav { flex: 1; padding: 24px 16px; overflow-y: auto; }
                .nav-section { font-size: 11px; font-weight: 700; color: #818cf8; letter-spacing: 0.1em; margin: 20px 0 8px 8px; }
                .nav-section:first-child { margin-top: 0; }
                .nav-item {
                    display: flex; align-items: center; padding: 12px 16px; color: #e0e7ff; text-decoration: none; 
                    border-radius: 10px; font-size: 14px; font-weight: 500; transition: all 0.2s; margin-bottom: 4px;
                }
                .nav-item:hover { background: rgba(255,255,255,0.1); color: white; }
                .nav-item.active { background: linear-gradient(135deg, rgba(102,126,234,0.8), rgba(118,75,162,0.8)); color: white; font-weight: 600; box-shadow: 0 4px 10px rgba(0,0,0,0.2); }
                .nav-icon { margin-right: 12px; font-size: 16px; opacity: 0.9; }
                
                .sidebar-footer { padding: 20px; border-top: 1px solid rgba(255,255,255,0.1); background: rgba(0,0,0,0.1); }
                .status-indicator { display: flex; align-items: center; font-size: 13px; color: #a5b4fc; font-weight: 500; }
                .status-dot { width: 8px; height: 8px; background-color: var(--success); border-radius: 50%; margin-right: 8px; box-shadow: 0 0 8px var(--success); }

                /* Main Wrapper & Topbar */
                .main-wrapper { flex: 1; display: flex; flex-direction: column; min-width: 0; }
                .topbar {
                    height: var(--topbar-height); background: var(--bg-panel); border-bottom: 1px solid var(--border);
                    display: flex; align-items: center; justify-content: space-between; padding: 0 32px; z-index: 10;
                }
                .topbar-search { display: flex; align-items: center; background: var(--bg-app); padding: 8px 16px; border-radius: 20px; width: 400px; border: 1px solid transparent; transition: border 0.2s; }
                .topbar-search:focus-within { border-color: var(--primary); background: white; }
                .topbar-search input { border: none; background: transparent; outline: none; margin-left: 10px; width: 100%; font-size: 14px; color: var(--text-main); }
                .topbar-search input::placeholder { color: #94a3b8; }
                
                .topbar-actions { display: flex; align-items: center; gap: 24px; }
                .action-btn { background: none; border: none; font-size: 20px; cursor: pointer; position: relative; color: var(--text-muted); transition: transform 0.2s; }
                .action-btn:hover { transform: scale(1.1); }
                .badge-dot { position: absolute; top: -2px; right: -2px; width: 10px; height: 10px; background: var(--danger); border-radius: 50%; border: 2px solid white; }
                
                .user-profile { display: flex; align-items: center; gap: 12px; cursor: pointer; border-left: 1px solid var(--border); padding-left: 24px; }
                .avatar { width: 36px; height: 36px; border-radius: 10px; background: linear-gradient(135deg, var(--primary), var(--secondary)); color: white; display: flex; align-items: center; justify-content: center; font-weight: 700; font-size: 14px; }
                .user-info { display: flex; flex-direction: column; }
                .user-name { font-size: 14px; font-weight: 600; color: var(--text-main); }
                .user-role { font-size: 12px; color: var(--text-muted); }

                /* Dashboard Content Area */
                .dashboard-content { flex: 1; overflow-y: auto; padding: 32px; scroll-behavior: smooth; }
                .page-header { margin-bottom: 24px; }
                .page-header h1 { font-size: 24px; font-weight: 700; color: var(--text-main); margin-bottom: 4px; letter-spacing: -0.5px; }
                .page-header p { color: var(--text-muted); font-size: 14px; }
                
                .section-title { font-size: 18px; font-weight: 700; color: var(--text-main); margin-top: 8px; margin-bottom: 16px; }

                /* KPIs */
                .kpi-grid { display: grid; grid-template-columns: repeat(5, 1fr); gap: 20px; margin-bottom: 24px; }
                .kpi-card { background: var(--bg-panel); padding: 20px; border-radius: 16px; box-shadow: 0 2px 6px rgba(0,0,0,0.02); border: 1px solid var(--border); transition: transform 0.2s, box-shadow 0.2s; }
                .kpi-card:hover { transform: translateY(-4px); box-shadow: 0 10px 20px rgba(0,0,0,0.05); }
                .kpi-header { font-size: 12px; font-weight: 700; color: var(--text-muted); text-transform: uppercase; letter-spacing: 0.05em; }
                .kpi-value { font-size: 28px; font-weight: 800; color: var(--text-main); margin: 8px 0; letter-spacing: -0.5px; }
                .kpi-trend { font-size: 13px; font-weight: 500; }
                .kpi-trend.positive { color: var(--success); }
                .kpi-trend.neutral { color: var(--text-muted); }
                .kpi-trend.negative { color: #8b5cf6; } 
                .alert-card { border-top: 4px solid #8b5cf6; }

                /* Grids for Panels */
                .dashboard-grid { display: grid; gap: 24px; margin-bottom: 24px; }
                .single-row { grid-template-columns: 1fr; }
                .side-by-side-row { grid-template-columns: 1.3fr 1fr; } /* Arch gets slightly more space */
                @media (max-width: 1200px) { .side-by-side-row { grid-template-columns: 1fr; } .kpi-grid { grid-template-columns: repeat(auto-fit, minmax(180px, 1fr)); } }
                
                /* General Panels */
                .panel { background: var(--bg-panel); border-radius: 16px; box-shadow: 0 2px 6px rgba(0,0,0,0.02); border: 1px solid var(--border); display: flex; flex-direction: column; overflow: hidden;}
                .panel-header { padding: 16px 20px; border-bottom: 1px solid var(--border); display: flex; justify-content: space-between; align-items: center; background: #f8fafc;}
                .panel-header h2 { font-size: 16px; font-weight: 700; color: var(--text-main); margin:0;}
                .panel-body { padding: 20px; flex: 1; }
                
                /* Badges */
                .badge { font-size: 11px; font-weight: 600; padding: 4px 10px; border-radius: 999px; background: #e0e7ff; color: #4338ca; }
                .badge.live { background-color: var(--danger); color: #ffffff; display: inline-flex; align-items: center; gap: 6px; text-transform: uppercase; letter-spacing: 0.05em; box-shadow: 0 0 0 0 rgba(239, 68, 68, 0.7); animation: livePulse 2s infinite; }
                .badge.live::before { content: ''; display: block; width: 6px; height: 6px; border-radius: 50%; background-color: #ffffff; }

                /* Architecture Diagram Layout adjustments for side-by-side */
                .arch-diagram { display: flex; flex-direction: column; align-items: center; width: 100%; padding: 10px 0; }
                .arch-row { display: flex; justify-content: center; width: 100%; z-index: 2; }
                .arch-split { display: flex; justify-content: space-around; gap: 10px; margin: 12px 0; width: 100%; max-width: 100%; }
                .arch-col { display: flex; flex-direction: column; align-items: center; width: 48%; }
                .arch-label { font-size: 11px; font-weight: 700; color: var(--text-muted); background: var(--bg-app); padding: 4px 12px; border-radius: 12px; text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 12px; text-align: center; }
                .arch-node { padding: 12px 14px; border-radius: 10px; font-size: 12px; font-weight: 600; text-align: center; width: 100%; max-width: 190px; box-shadow: 0 2px 4px rgba(0,0,0,0.05); background: white; border: 1px solid #cbd5e1; color: var(--text-main); line-height: 1.4; transition: transform 0.2s; }
                .arch-node:hover { transform: translateY(-2px); box-shadow: 0 6px 12px rgba(0,0,0,0.1); }
                .arch-node strong { display: block; font-size: 13px; margin-bottom: 2px; }
                .arch-node small { font-weight: 400; font-size: 10px; opacity: 0.85; display: block; }
                .arch-arrow { font-size: 16px; color: #94a3b8; margin: 4px 0; font-weight: bold; line-height: 1; }
                .arch-converge { display: flex; justify-content: center; gap: 60px; width: 100%; max-width: 100%; }
                
                /* Node Types */
                .ui-node { background: #eff6ff; border-color: #bfdbfe; color: #1e3a8a; }
                .ui-node.chat-theme { background: var(--primary); border-color: var(--primary-dark); color: white; }
                .ui-node.feedback { background: #f0fdf4; border-color: #bbf7d0; color: #166534; }
                .db-node { background: #f8fafc; border: 2px solid #94a3b8; border-top-width: 6px; }
                .script-node { background: #fffbeb; border: 1px dashed #f59e0b; color: #b45309; }
                .ext-node.llm { background: #f0fdfa; border: 2px solid #5eead4; color: #0f766e; max-width: 240px;}

                /* Impact Feed */
                .impact-feed { display: flex; flex-direction: column; gap: 12px; }
                .impact-item { display: flex; gap: 16px; padding: 16px; border-radius: 12px; border: 1px solid var(--border); background: #f8fafc; transition: transform 0.2s; }
                .impact-item:hover { transform: translateX(4px); }
                .impact-item.high-risk { border-left: 4px solid var(--danger); background: #fef2f2; }
                .impact-item.medium-risk { border-left: 4px solid var(--warning); background: #fffbeb; }
                .impact-icon { font-size: 20px; margin-top: 2px;}
                .impact-details h4 { font-size: 14px; color: var(--text-main); margin-bottom: 4px; }
                .impact-details h4 span { font-family: monospace; color: var(--text-muted); font-weight: normal; font-size: 12px; }
                .impact-desc { font-size: 13px; color: var(--text-muted); margin-bottom: 8px; }
                .impact-assessment { background: rgba(255,255,255,0.7); padding: 10px; border-radius: 8px; font-size: 12px; color: var(--text-main); margin-bottom: 8px; border: 1px dashed #cbd5e1; }
                .impact-action { font-size: 12px; font-weight: 600; color: var(--primary-dark); display: inline-flex; align-items: center; gap: 4px; }

                /* Document List configured as a responsive grid */
                .view-all { font-size: 12px; color: var(--primary); text-decoration: none; font-weight: 600; }
                .view-all:hover { text-decoration: underline; }
                .doc-list { list-style: none; display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 16px; }
                .doc-list li { display: flex; align-items: center; padding: 16px; border: 1px solid var(--border); border-radius: 10px; background: white; transition: box-shadow 0.2s, transform 0.2s;}
                .doc-list li:hover { box-shadow: 0 4px 10px rgba(0,0,0,0.05); transform: translateY(-2px);}
                .doc-icon { font-size: 24px; margin-right: 16px; }
                .doc-info { flex: 1; display: flex; flex-direction: column; }
                .doc-info strong { font-size: 13px; color: var(--text-main); margin-bottom: 2px;}
                .doc-info span { font-size: 11px; color: var(--text-muted); }
                .doc-status { font-size: 11px; font-weight: 600; padding: 4px 8px; border-radius: 6px; white-space: nowrap; margin-left: 12px;}
                .doc-status.success { background: #dcfce7; color: #166534; }
                .doc-status.archived { background: #f1f5f9; color: #475569; }

                /* Animations */
                @keyframes livePulse { 0% { box-shadow: 0 0 0 0 rgba(239, 68, 68, 0.7); } 70% { box-shadow: 0 0 0 6px rgba(239, 68, 68, 0); } 100% { box-shadow: 0 0 0 0 rgba(239, 68, 68, 0); } }
            </style>`;
        }

        return { onRequest };
    });
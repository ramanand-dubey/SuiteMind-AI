/**
 * @NApiVersion 2.1
 * @NScriptType Suitelet
 * @NModuleScope SameAccount
 * */
/**
 * Version       Date           Author                 Description
 * 1.0           25-02-2026     Ramanand Dubey         Initial version - SuiteMind AI Admin UI - For PDF Upload
 */

define(['N/runtime', 'N/log', 'N/url', 'N/search', 'N/record'],
    /**
     * @param {runtime} runtime
     * @param {log} log
     * @param {url} url
     * @param {search} search
     * @param {record} record
     */
    (runtime, log, url, search, record) => {

        // Form field IDs
        const FIELD_ID_FILE = 'custpage_pdf_file';
        const FIELD_FUNCTIONALITY_NAME = 'custpage_functionality_name';
        const FIELD_FUNCTIONALITY_OWNER = 'custpage_functionality_owner';

        // Script parameter: File Cabinet folder internal ID
        const PARAM_FOLDER_ID = 'ntx_sm_upload_folder';

        /**
         * Suitelet entry point. GET: show upload form. POST: process upload and save to File Cabinet.
         * @param {Object} scriptContext
         * @param {ServerRequest} scriptContext.request
         * @param {ServerResponse} scriptContext.response
         */
        function onRequest(scriptContext) {
            const request = scriptContext.request;
            const response = scriptContext.response;

            if (request.method === 'POST') {
                handlePost(request, response);
            } else {
                showUploadForm(request, response);
            }
        }

        /**
         * Show the upload form (GET). Renders a full custom HTML page.
         * @param {ServerRequest} request
         * @param {ServerResponse} response
         */
        function showUploadForm(request, response) {
            const folderId = getFolderId();
            const suiteletUrl = getSuiteletUrl();
            const employeeList = getEmployeeList();
            const html = getUploadPageHtml(suiteletUrl, folderId, employeeList);
            response.write(html);
        }

        /**
         * Process POST: validate, save uploaded file to File Cabinet, show result.
         * @param {ServerRequest} request
         * @param {ServerResponse} response
         */
        function handlePost(request, response) {
            const folderId = getFolderId();
            if (!folderId) {
                writeMessagePage(
                    response,
                    'Configuration error',
                    'Folder ID is not set. Configure the script parameter and try again.',
                    true
                );
                return;
            }

            const uploadedFile = request.files && request.files[FIELD_ID_FILE];
            if (!uploadedFile) {
                writeMessagePage(
                    response,
                    'No file selected',
                    'Please choose a PDF file and click Upload.',
                    true
                );
                return;
            }

            if (!isPdfFile(uploadedFile)) {
                writeMessagePage(
                    response,
                    'Invalid file type',
                    'Only PDF files are allowed. Please select a PDF file and try again.',
                    true
                );
                return;
            }

            const functionalityName = (request.parameters[FIELD_FUNCTIONALITY_NAME] || '').toString().trim();
            const functionalityOwner = (request.parameters[FIELD_FUNCTIONALITY_OWNER] || '').toString().trim();

            try {
                uploadedFile.folder = parseInt(folderId, 10);

                if (functionalityName) {
                    const safeName = `${sanitizeFileName(functionalityName)}.pdf`;
                    try {
                        uploadedFile.name = safeName;
                    } catch (nameErr) {
                        log.debug('upload file name', `Could not set name: ${nameErr.message}`);
                    }
                }

                const fileId = uploadedFile.save();
                log.audit('SuiteMind PDF uploaded', {
                    fileId: fileId,
                    folderId: folderId,
                    functionalityName: functionalityName || null,
                    functionalityOwner: functionalityOwner || null
                });

                const ownerDisplayName = functionalityOwner ? getEmployeeNameById(functionalityOwner) : '';
                let successMsg = `The document has been successfully saved to the File Cabinet.<br><strong>File internal ID:</strong> ${fileId}`;
                if (functionalityName) {
                    successMsg += `<br><strong>Functionality name:</strong> ${escapeHtml(functionalityName)}`;
                }
                if (functionalityOwner) {
                    successMsg += `<br><strong>Functionality owner:</strong> ${escapeHtml(ownerDisplayName || functionalityOwner)}`;
                }
                successMsg += '<br><br>The document has been added to the SuiteMind AI knowledge base and will be used to improve the accuracy of responses to user inquiries.';

                writeMessagePage(response, 'Upload successful', successMsg, false);
            } catch (e) {
                log.error('SuiteMind PDF upload error', e);
                writeMessagePage(
                    response,
                    'Upload failed',
                    `An error occurred while saving the file: ${escapeHtml(String(e.message || e))}`,
                    true
                );
            }
        }

        /**
         * Sanitize a string for use as a file name (alphanumeric, spaces, hyphens, underscores).
         * @param {string} s
         * @returns {string}
         */
        function sanitizeFileName(s) {
            return s.replace(/[<>:"/\\|?*\x00-\x1f]/g, '')
                .replace(/\s+/g, ' ')
                .trim()
                .substring(0, 200) || 'document';
        }

        /**
         * Check if the uploaded file is a PDF (by name extension). Server-side guard.
         * @param {Object} fileObj - File from request.files
         * @returns {boolean}
         */
        function isPdfFile(fileObj) {
            try {
                const name = (fileObj.name || fileObj.getValue?.('name') || '').toString();
                return /\.pdf$/i.test(name);
            } catch (e) {
                return false;
            }
        }

        /**
         * Build JSON string of employee list for client-side autocomplete.
         * @param {Array<{id: string, name: string}>} employeeList
         * @returns {string} JSON-escaped string
         */
        function getEmployeeListJson(employeeList) {
            try {
                return JSON.stringify(employeeList || [])
                    .replace(/</g, '\\u003c')
                    .replace(/>/g, '\\u003e');
            } catch (e) {
                return '[]';
            }
        }

        /**
         * Get employee display name by internal ID (for success message).
         * @param {string} employeeId
         * @returns {string}
         */
        function getEmployeeNameById(employeeId) {
            if (!employeeId) return '';
            try {
                const emp = record.load({ type: record.Type.EMPLOYEE, id: employeeId });
                const first = emp.getValue({ fieldId: 'firstname' }) || '';
                const last = emp.getValue({ fieldId: 'lastname' }) || '';
                return `${first} ${last}`.trim() || employeeId;
            } catch (e) {
                log.debug('getEmployeeNameById', e.message);
                return employeeId;
            }
        }

        /**
         * Get list of active employees for the Functionality owner autocomplete.
         * @returns {Array<{id: string, name: string}>}
         */
        function getEmployeeList() {
            const empList = [];
            try {
                const empSearch = search.create({
                    type: 'employee',
                    filters: [['isinactive', 'is', 'F'], /*"AND",
                    ["supervisor", "anyof", "12433852", "280535"]*/],
                    columns: [
                        search.createColumn({ name: 'internalid', label: 'Internal ID', sort: search.Sort.ASC }),
                        search.createColumn({ name: 'firstname', label: 'First Name' }),
                        search.createColumn({ name: 'lastname', label: 'Last Name' })
                    ]
                });

                // Use runPaged to bypass 4000-result limit of run().each()/forEachResult
                const pagedData = empSearch.runPaged({ pageSize: 1000 });
                pagedData.pageRanges.forEach(function (pageRange) {
                    const page = pagedData.fetch({ index: pageRange.index });
                    page.data.forEach(function (result) {
                        const id = result.getValue({ name: 'internalid' });
                        const first = result.getValue({ name: 'firstname' }) || '';
                        const last = result.getValue({ name: 'lastname' }) || '';
                        const name = `${first} ${last}`.trim() || String(id);
                        log.debug('Employee name', name);
                        empList.push({ id: String(id), name: name });
                    });
                });
            } catch (e) {
                log.error('getEmployeeList', e);
            }
            return empList;
        }

        /**
         * Get File Cabinet folder ID from script parameter (deployment-specific).
         * @returns {string|number|null} Folder internal ID or null if not set
         */
        function getFolderId() {
            try {
                const script = runtime.getCurrentScript();
                const param = script.getParameter({ name: PARAM_FOLDER_ID }) || 70804; // Folder Path : SuiteMind AI/Process Files
                if (param !== null && param !== undefined && param !== '') {
                    return param;
                }
            } catch (e) {
                log.debug('getFolderId', e.message);
            }
            return null;
        }

        /**
         * Build the document details form section (step 1).
         * @returns {string}
         */
        function getDocumentDetailsSectionHtml() {
            return `<section class="upload-section">
                <h2 class="upload-section-title"><span class="upload-section-num">1</span> Document details</h2>
                <div class="upload-row">
                  <div class="upload-field upload-field-half">
                    <label class="upload-label" for="${FIELD_FUNCTIONALITY_NAME}">Functionality name</label>
                    <input type="text" id="${FIELD_FUNCTIONALITY_NAME}" name="${FIELD_FUNCTIONALITY_NAME}" class="upload-input" placeholder="e.g. Purge Framework" maxlength="200" autocomplete="off">
                  </div>
                  <div class="upload-field upload-field-half">
                    <label class="upload-label" for="owner-autocomplete">Functionality owner</label>
                    <div class="upload-owner-wrap">
                      <input type="text" id="owner-autocomplete" class="upload-input" placeholder="Type to search owner..." autocomplete="off">
                      <input type="hidden" id="${FIELD_FUNCTIONALITY_OWNER}" name="${FIELD_FUNCTIONALITY_OWNER}" value="">
                      <ul class="upload-owner-list" id="owner-suggestions" role="listbox" aria-label="Owner suggestions"></ul>
                    </div>
                  </div>
                </div>
              </section>`;
        }

        /**
         * Build the file selection form section (step 2).
         * @returns {string}
         */
        function getFileSelectionSectionHtml() {
            return `<section class="upload-section">
                <h2 class="upload-section-title"><span class="upload-section-num">2</span> Choose your PDF</h2>
                <div class="upload-field">
                  <div class="upload-dropzone" id="upload-dropzone">
                    <input type="file" id="custpage_pdf_file" name="${FIELD_ID_FILE}" accept="application/pdf" class="upload-file-input" required>
                    <div class="upload-dropzone-inner">
                      <div class="upload-dropzone-icon"><svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg></div>
                      <p class="upload-dropzone-text"><span id="upload-file-name">Click or drag a PDF here</span></p>
                      <p class="upload-dropzone-hint">PDF only · Max size per file as per NetSuite limits</p>
                    </div>
                  </div>
                  <div id="upload-file-error" class="upload-error" role="alert" style="display:none;"></div>
                </div>
              </section>`;
        }

        /**
         * Build the file upload client script (validation and drag-and-drop).
         * @returns {string}
         */
        function getFileUploadScript() {
            return `(function(){
                var input=document.getElementById("custpage_pdf_file");var nameEl=document.getElementById("upload-file-name");
                var errEl=document.getElementById("upload-file-error");var drop=document.getElementById("upload-dropzone");
                var form=input.closest("form");
                function isPdf(f){if(!f)return false;var n=(f.name||"").toLowerCase();return n.indexOf(".pdf")===n.length-4||f.type==="application/pdf";}
                function showErr(msg){errEl.textContent=msg||"";errEl.style.display=msg?"block":"none";}
                function setFileName(name){nameEl.textContent=name||"Click or drag a PDF here";drop.classList.toggle("has-file",!!name);}
                function onChange(){var f=input.files[0];var name=f?f.name:"";
                if(f&&!isPdf(f)){showErr("Only PDF files are allowed. Please select a PDF file.");input.value="";setFileName("");return;}
                showErr("");setFileName(name);}
                input.addEventListener("change",onChange);
                form.addEventListener("submit",function(e){var f=input.files[0];
                if(f&&!isPdf(f)){e.preventDefault();showErr("Only PDF files are allowed. Please select a PDF file.");return false;}showErr("");return true;});
                if(drop){["dragenter","dragover","dragleave","drop"].forEach(function(ev){drop.addEventListener(ev,function(e){e.preventDefault();e.stopPropagation();});});
                drop.addEventListener("drop",function(e){var f=e.dataTransfer&&e.dataTransfer.files[0];if(f){input.files=e.dataTransfer.files;onChange();}});
                drop.addEventListener("click",function(){input.click();});}
            })();`;
        }

        /**
         * Build the owner autocomplete client script.
         * @param {string} employeeListJson - JSON string of employees
         * @returns {string}
         */
        function getOwnerAutocompleteScript(employeeListJson) {
            return `(function(){
                var employees=${employeeListJson};
                var acInput=document.getElementById("owner-autocomplete");var acHidden=document.getElementById("${FIELD_FUNCTIONALITY_OWNER}");
                var acList=document.getElementById("owner-suggestions");if(!acInput||!acHidden||!acList)return;
                function filterEmployees(q){var qq=(q||"").toLowerCase().trim();
                var list=qq?employees.filter(function(e){return(e.name||"").toLowerCase().indexOf(qq)>=0;}):employees;return list.slice(0,50);}
                function renderList(items){acList.innerHTML="";items.forEach(function(emp){var li=document.createElement("li");li.className="upload-owner-item";
                li.role="option";li.textContent=emp.name;li.dataset.id=emp.id;li.dataset.name=emp.name;acList.appendChild(li);});acList.classList.toggle("open",items.length>0);}
                function selectOwner(id,name){acHidden.value=id||"";acInput.value=name||"";acList.classList.remove("open");}
                acInput.addEventListener("input",function(){var q=this.value;if(!q.trim())acHidden.value="";var matches=filterEmployees(q);renderList(matches);});
                acInput.addEventListener("focus",function(){var matches=filterEmployees(this.value);renderList(matches);});
                acList.addEventListener("click",function(e){var li=e.target.closest(".upload-owner-item");if(li){selectOwner(li.dataset.id,li.dataset.name);}});
                document.addEventListener("click",function(e){if(!e.target.closest(".upload-owner-wrap"))acList.classList.remove("open");});
            })();`;
        }

        /**
         * Build the full upload page HTML.
         * @param {string} suiteletUrl - Form action URL
         * @param {string|number|null} folderId - Configured folder ID or null
         * @param {Array<{id: string, name: string}>} employeeList - List of employees for owner autocomplete
         * @returns {string}
         */
        function getUploadPageHtml(suiteletUrl, folderId, employeeList) {
            const employeeListJson = getEmployeeListJson(employeeList || []);

            return `<!DOCTYPE html><html lang="en">
                <head>
                  <meta charset="UTF-8">
                  <meta name="viewport" content="width=device-width, initial-scale=1">
                  <title>SuiteMind AI – Upload PDF</title>
                  ${getUploadStyles()}
                </head>
                <body>
                  <div class="upload-page">
                    <div class="upload-bg"></div>
                    <div class="upload-wrap">
                      <div class="upload-card">
                        <header class="upload-hero">
                          <div class="upload-hero-badge">Knowledge Base</div>
                          <h1 class="upload-hero-title">Enhance SuiteMind AI</h1>
                          <p class="upload-hero-desc">Upload a PDF that describes your NetSuite functionality. It will be stored securely and used to power smarter answers.</p>
                        </header>
                        <div class="upload-content">
                          <form class="upload-form" method="POST" enctype="multipart/form-data" action="${escapeHtml(suiteletUrl)}">
                            ${getDocumentDetailsSectionHtml()}
                            ${getFileSelectionSectionHtml()}
                            <div class="upload-actions">
                              <button type="submit" class="upload-btn" id="upload-submit-btn">
                                <span class="upload-btn-text">Upload To Knowledge Base</span>
                                <span class="upload-btn-icon"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="12" y1="19" x2="12" y2="5"/><polyline points="5 12 12 5 19 12"/></svg></span>
                              </button>
                            </div>
                          </form>
                        </div>
                      </div>
                    </div>
                  </div>
                <script>${getFileUploadScript()}${getOwnerAutocompleteScript(employeeListJson)}</script>
                </body></html>`;
        }

        /**
         * CSS for upload page.
         * @returns {string}
         */
        function getUploadStyles() {
            return `<style>
                *{box-sizing:border-box}
                body{margin:0;padding:0;min-height:100vh;font-family:"Segoe UI",system-ui,-apple-system,BlinkMacSystemFont,Roboto,"Helvetica Neue",Arial,sans-serif;font-size:16px;line-height:1.5;color:#1a1a2e;-webkit-font-smoothing:antialiased}
                .upload-page{min-height:100vh;position:relative;display:flex;align-items:center;justify-content:center;padding:32px 20px}
                .upload-bg{position:fixed;inset:0;background:linear-gradient(135deg,#0f0c29 0%,#302b63 40%,#24243e 100%);z-index:0}
                .upload-bg::before{content:"";position:absolute;inset:0;background:radial-gradient(ellipse 80% 50% at 50% -20%,rgba(120,119,198,0.35),transparent),radial-gradient(ellipse 60% 40% at 100% 0%,rgba(99,102,241,0.2),transparent),radial-gradient(ellipse 50% 30% at 0% 100%,rgba(16,185,129,0.15),transparent);pointer-events:none}
                .upload-wrap{position:relative;z-index:1;width:100%;max-width:640px}
                @keyframes cardIn{from{opacity:0;transform:translateY(24px) scale(0.98)}to{opacity:1;transform:translateY(0) scale(1)}}
                .upload-card{background:rgba(255,255,255,0.97);backdrop-filter:blur(20px);-webkit-backdrop-filter:blur(20px);border-radius:24px;box-shadow:0 32px 64px rgba(0,0,0,0.25),0 0 0 1px rgba(255,255,255,0.1) inset;overflow:hidden;animation:cardIn 0.5s cubic-bezier(0.22,1,0.36,1)}
                .upload-hero{text-align:center;padding:40px 32px 36px;background:linear-gradient(160deg,#6366f1 0%,#4f46e5 50%,#4338ca 100%);position:relative;overflow:hidden}
                .upload-hero::after{content:"";position:absolute;bottom:0;left:0;right:0;height:1px;background:linear-gradient(90deg,transparent,rgba(255,255,255,0.3),transparent)}
                .upload-hero-badge{display:inline-block;padding:6px 14px;background:rgba(255,255,255,0.2);color:rgba(255,255,255,0.95);font-size:12px;font-weight:600;letter-spacing:0.06em;text-transform:uppercase;border-radius:999px;margin-bottom:16px}
                .upload-hero-title{margin:0;font-size:28px;font-weight:700;color:#fff;letter-spacing:-0.02em;line-height:1.2;text-shadow:0 2px 12px rgba(0,0,0,0.2)}
                .upload-hero-desc{margin:14px 0 0 0;font-size:15px;color:rgba(255,255,255,0.9);max-width:420px;margin-left:auto;margin-right:auto;line-height:1.55}
                .upload-content{padding:32px 28px 36px}
                .upload-form{margin:0}
                .upload-section{margin-bottom:28px}
                .upload-section:last-of-type{margin-bottom:24px}
                .upload-section-title{display:flex;align-items:center;gap:12px;margin:0 0 18px 0;font-size:15px;font-weight:600;color:#374151}
                .upload-section-num{display:inline-flex;align-items:center;justify-content:center;width:26px;height:26px;background:linear-gradient(135deg,#10b981 0%,#059669 100%);color:#fff;font-size:13px;font-weight:700;border-radius:8px}
                .upload-row{display:flex;gap:20px}
                .upload-field{margin-bottom:18px}
                .upload-field:last-child{margin-bottom:0}
                .upload-field-half{flex:1;min-width:0}
                .upload-label{display:block;font-size:13px;font-weight:600;color:#4b5563;margin-bottom:8px}
                .upload-input,.upload-select{width:100%;padding:14px 16px;font-size:15px;color:#111827;background:#f8fafc;border:1px solid #e2e8f0;border-radius:12px;font-family:inherit;transition:border-color 0.2s,box-shadow 0.2s,background 0.2s}
                .upload-input:focus,.upload-select:focus{outline:none;border-color:#10b981;box-shadow:0 0 0 3px rgba(16,185,129,0.2);background:#fff}
                .upload-input::placeholder{color:#94a3b8}
                .upload-owner-wrap{position:relative}
                .upload-owner-list{position:absolute;top:100%;left:0;right:0;margin:4px 0 0 0;padding:6px 0;background:#fff;border:1px solid #e2e8f0;border-radius:12px;box-shadow:0 10px 40px rgba(0,0,0,0.12);list-style:none;max-height:220px;overflow-y:auto;display:none;z-index:20}
                .upload-owner-list.open{display:block}
                .upload-owner-item{padding:10px 16px;font-size:15px;color:#374151;cursor:pointer;transition:background 0.15s}
                .upload-owner-item:hover,.upload-owner-item:focus{background:#f0fdf4;outline:none}
                .upload-select{cursor:pointer;appearance:none;background-image:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='%234b5563' stroke-width='2'%3E%3Cpath d='M6 9l6 6 6-6'/%3E%3C/svg%3E");background-repeat:no-repeat;background-position:right 14px center;padding-right:42px}
                .upload-dropzone{position:relative;border:2px dashed #cbd5e1;border-radius:16px;padding:36px 24px;text-align:center;cursor:pointer;transition:all 0.25s ease;background:#f8fafc}
                .upload-dropzone:hover,.upload-dropzone:focus-within{border-color:#10b981;background:rgba(16,185,129,0.04)}
                .upload-dropzone.has-file{border-color:#10b981;border-style:solid;background:rgba(16,185,129,0.06)}
                .upload-file-input{position:absolute;inset:0;width:100%;height:100%;opacity:0;cursor:pointer;font-size:0}
                .upload-dropzone-inner{pointer-events:none}
                .upload-dropzone-icon{color:#64748b;margin:0 auto 14px;display:flex;align-items:center;justify-content:center}
                .upload-dropzone-icon svg{width:48px;height:48px}
                .upload-dropzone.has-file .upload-dropzone-icon{color:#10b981}
                .upload-dropzone-text{margin:0;font-size:15px;font-weight:600;color:#334155}
                .upload-dropzone-hint{margin:6px 0 0 0;font-size:13px;color:#94a3b8}
                .upload-error{margin-top:12px;padding:12px 14px;background:#fef2f2;border:1px solid #fecaca;border-radius:10px;font-size:14px;color:#b91c1c}
                .upload-actions{margin-top:8px}
                .upload-btn{display:inline-flex;align-items:center;justify-content:center;gap:10px;width:100%;padding:16px 24px;background:linear-gradient(135deg,#10b981 0%,#059669 100%);color:#fff;border:none;border-radius:14px;font-size:16px;font-weight:600;font-family:inherit;cursor:pointer;box-shadow:0 4px 14px rgba(16,185,129,0.4);transition:transform 0.2s,box-shadow 0.2s}
                .upload-btn:hover{transform:translateY(-2px);box-shadow:0 8px 24px rgba(16,185,129,0.45)}
                .upload-btn:active{transform:translateY(0)}
                .upload-btn-icon{display:flex;align-items:center;justify-content:center}
                @media (max-width:600px){.upload-hero{padding:32px 24px 28px}.upload-hero-title{font-size:24px}.upload-content{padding:24px 20px 28px}.upload-row{flex-direction:column;gap:0}.upload-field-half{margin-bottom:18px}.upload-dropzone{padding:28px 20px}}
            </style>`;
        }

        /**
         * Write result page (success or error) with SuiteMind styling.
         * @param {ServerResponse} response
         * @param {string} title
         * @param {string} bodyHtml
         * @param {boolean} isError
         */
        function writeMessagePage(response, title, bodyHtml, isError) {
            const suiteletUrl = getSuiteletUrl();
            //log.debug("suiteletUrl",suiteletUrl);
            const homeSuiteletUrl = `https://tstdrv2146048.app.netsuite.com/app/site/hosting/scriptlet.nl?script=627&deploy=1&compid=TSTDRV2146048`
            const backUrl = (suiteletUrl && suiteletUrl !== '#') ? suiteletUrl : '#';
            const cardClass = isError ? 'result-card result-card--error' : 'result-card result-card--success';
            const iconSvg = isError
                ? '<svg class="result-icon-svg" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>'
                : '<svg class="result-icon-svg result-icon-svg--success" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>';

            const backLinkHtml = (backUrl !== '#')
                ? `<a href="${escapeHtml(homeSuiteletUrl)}" class="result-back-link" onclick="event.preventDefault();window.top.location.href=this.href;return false;">← Go Back</a>`
                : '';

            const html = `<!DOCTYPE html><html lang="en">
                <head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1">
                <title>${escapeHtml(title)}</title>${getResultPageStyles()}</head>
                <body>
                  <div class="result-page">
                    <div class="result-bg"></div>
                    <div class="result-wrap">
                      <div class="result-card ${cardClass}">
                        <div class="result-icon">${iconSvg}</div>
                        <h1 class="result-title">${escapeHtml(title)}</h1>
                        <div class="result-body">${bodyHtml}</div>
                        ${backLinkHtml}
                      </div>
                    </div>
                  </div>
                </body></html>`;

            response.write(html);
        }

        /**
         * CSS for result (success/error) page.
         * @returns {string}
         */
        function getResultPageStyles() {
            return `<style>
                *{box-sizing:border-box}
                body{margin:0;padding:0;min-height:100vh;font-family:"Segoe UI",system-ui,-apple-system,BlinkMacSystemFont,Roboto,"Helvetica Neue",Arial,sans-serif;-webkit-font-smoothing:antialiased}
                .result-page{min-height:100vh;position:relative;display:flex;align-items:center;justify-content:center;padding:32px 20px}
                .result-bg{position:fixed;inset:0;background:linear-gradient(135deg,#0f0c29 0%,#302b63 40%,#24243e 100%);z-index:0}
                .result-bg::before{content:"";position:absolute;inset:0;background:radial-gradient(ellipse 80% 50% at 50% -20%,rgba(120,119,198,0.35),transparent);pointer-events:none}
                .result-wrap{position:relative;z-index:1;width:100%;max-width:480px}
                @keyframes resultIn{from{opacity:0;transform:translateY(20px) scale(0.96)}to{opacity:1;transform:translateY(0) scale(1)}}
                .result-card{background:rgba(255,255,255,0.97);backdrop-filter:blur(20px);border-radius:24px;box-shadow:0 32px 64px rgba(0,0,0,0.25),0 0 0 1px rgba(255,255,255,0.1) inset;padding:40px 32px;text-align:center;animation:resultIn 0.45s cubic-bezier(0.22,1,0.36,1)}
                .result-card--success{border-top:4px solid #10b981}
                .result-card--error{border-top:4px solid #ef4444}
                .result-icon{margin-bottom:24px;display:flex;align-items:center;justify-content:center}
                .result-icon-svg{color:#94a3b8}
                .result-icon-svg--success{color:#10b981}
                .result-card--error .result-icon-svg{color:#ef4444}
                .result-title{margin:0 0 16px 0;font-size:22px;font-weight:700;color:#1e293b}
                .result-body{font-size:15px;line-height:1.65;color:#475569;text-align:left}
                .result-body strong{color:#1e293b}
                .result-back-link{display:inline-flex;align-items:center;gap:8px;margin-top:28px;padding:14px 24px;background:linear-gradient(135deg,#10b981 0%,#059669 100%);color:#fff!important;border:none;border-radius:12px;font-family:inherit;font-size:15px;font-weight:600;text-decoration:none;box-shadow:0 4px 14px rgba(16,185,129,0.4);transition:transform 0.2s,box-shadow 0.2s;cursor:pointer}
                .result-back-link:hover{transform:translateY(-2px);box-shadow:0 8px 24px rgba(16,185,129,0.45);color:#fff}
            </style>`;
        }

        /**
         * Get current Suitelet URL for the "Upload another file" link.
         * @returns {string}
         */
        function getSuiteletUrl() {
            try {
                const script = runtime.getCurrentScript();
                const path = url.resolveScript({
                    scriptId: script.id,
                    deploymentId:script.deploymentId
                });
                return `https://${url.resolveDomain({
                    hostType: url.HostType.APPLICATION,
                    accountId: runtime.accountId
                })}${path}`;
            } catch (e) {
                log.debug('getSuiteletUrl', e.message);
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
                "'": '&#039;'
            };
            return String(text).replace(/[&<>"']/g, function (m) { return map[m]; });
        }

        return { onRequest: onRequest };
    });
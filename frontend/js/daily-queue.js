
document.addEventListener("DOMContentLoaded", () => {
    const API = "https://healthcare-connect-api.onrender.com/api/daily-queue";

    const panels = document.querySelectorAll(".dq-panel");
    const tabs = document.querySelectorAll(".dq-tab");
    const message = document.getElementById("dqMessage");

    const bookForm = document.getElementById("bookTokenForm");
    const bookButton = document.getElementById("bookTokenButton");
    const centreSelect = document.getElementById("centreSelect");
    const queueCentreSelect = document.getElementById("queueCentreSelect");

    const myTokenContent = document.getElementById("myTokenContent");
    const queueContent = document.getElementById("queueContent");
    const historyContent = document.getElementById("historyContent");

    const tokenCache = [];

    function getToken() {
        return localStorage.getItem("healthcareToken");
    }

    async function apiRequest(path, options = {}) {
        const token = getToken();

        if (!token) {
            throw new Error("Please log in to use daily tokens.");
        }

        const response = await fetch(`${API}${path}`, {
            ...options,
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
                ...(options.headers || {})
            }
        });

        let result;

        try {
            result = await response.json();
        } catch {
            throw new Error("The server returned an unreadable response.");
        }

        if (!response.ok || result.success === false) {
            throw new Error(
                result.message || `Request failed (${response.status}).`
            );
        }

        return result;
    }

    function showMessage(text, type = "success") {
        message.textContent = text;
        message.className = `dq-message ${type}`;
        message.hidden = false;
        message.scrollIntoView({ behavior: "smooth", block: "nearest" });
    }

    function hideMessage() {
        message.hidden = true;
        message.textContent = "";
        message.className = "dq-message";
    }

    function escapeHTML(value) {
        return String(value ?? "").replace(/[&<>"']/g, char => ({
            "&": "&amp;",
            "<": "&lt;",
            ">": "&gt;",
            '"': "&quot;",
            "'": "&#039;"
        })[char]);
    }

    function getData(result) {
        return result?.data?.data ?? result?.data ?? [];
    }

    function formatDate(value) {
        if (!value) return "Date unavailable";

        const date = new Date(value);

        if (Number.isNaN(date.getTime())) {
            return String(value);
        }

        return date.toLocaleDateString("en-IN", {
            day: "numeric",
            month: "short",
            year: "numeric"
        });
    }

    function statusClass(status) {
        return String(status || "WAITING")
            .toLowerCase()
            .replace(/_/g, "-");
    }

    function statusLabel(status) {
        return String(status || "WAITING")
            .replace(/_/g, " ");
    }

    function tokenLabel(token) {
        if (token.tokenLabel) return token.tokenLabel;

        const number = String(token.token_number ?? "").padStart(3, "0");
        return `G-${number}`;
    }

    function centreName(token) {
        return token.centre_name ||
            token.centreName ||
            "Healthcare centre";
    }

    function renderEmpty(container, title, description, icon = "inbox") {
        container.innerHTML = `
            <div class="dq-empty-state">
                <span class="material-icons">${icon}</span>
                <h3>${escapeHTML(title)}</h3>
                <p>${escapeHTML(description)}</p>
            </div>
        `;
    }

    function tokenCard(token, history = false) {
        const status = statusLabel(token.status);
        const bookingType = token.booking_type || token.bookingType || "REMOTE";

        return `
            <article class="dq-token-card">
                <div class="dq-token-card-top">
                    <div>
                        <p class="dq-token-label">
                            ${escapeHTML(tokenLabel(token))}
                        </p>
                        <p class="dq-token-centre">
                            ${escapeHTML(centreName(token))}
                        </p>
                    </div>

                    <span class="dq-status status-${escapeHTML(statusClass(token.status))}">
                        ${escapeHTML(status)}
                    </span>
                </div>

                <div class="dq-token-meta">
                    <span>
                        <i class="material-icons">calendar_today</i>
                        ${escapeHTML(formatDate(token.queue_date || token.queueDate))}
                    </span>
                    <span>
                        <i class="material-icons">medical_services</i>
                        ${escapeHTML(String(token.service_type || token.serviceType || "GENERAL_CHECKUP").replace(/_/g, " "))}
                    </span>
                    <span>
                        <i class="material-icons">how_to_reg</i>
                        ${escapeHTML(String(bookingType).replace(/_/g, " "))}
                    </span>
                </div>

                ${history ? "" : `
                    <div style="margin-top:16px">
                        <button
                            type="button"
                            class="dq-text-btn"
                            data-view-queue="${escapeHTML(token.centre_id || token.centreId || "")}"
                        >
                            View this centre's queue →
                        </button>
                    </div>
                `}
            </article>
        `;
    }

    async function loadMyTokens(showLoading = true) {
        if (showLoading) {
            myTokenContent.innerHTML =
                '<div class="dq-loading">Loading your tokens…</div>';
        }

        try {
            const result = await apiRequest("/my-tokens");
            const data = getData(result);
            const tokens = Array.isArray(data) ? data : [];

            tokenCache.length = 0;
            tokenCache.push(...tokens);

            if (!tokens.length) {
                renderEmpty(
                    myTokenContent,
                    "No tokens yet",
                    "Book a daily token to see your visit details here.",
                    "confirmation_number"
                );
                return tokens;
            }

            myTokenContent.innerHTML = tokens
                .map(token => tokenCard(token))
                .join("");

            return tokens;
        } catch (error) {
            renderEmpty(myTokenContent, "Couldn't load tokens", error.message, "cloud_off");
            throw error;
        }
    }

    async function loadHistory() {
        historyContent.innerHTML =
            '<div class="dq-loading">Loading token history…</div>';

        try {
            const result = await apiRequest("/my-tokens");
            const data = getData(result);
            const tokens = Array.isArray(data) ? data : [];

            if (!tokens.length) {
                renderEmpty(
                    historyContent,
                    "No token history",
                    "Your token records will appear here after booking.",
                    "history"
                );
                return;
            }

            historyContent.innerHTML = tokens
                .map(token => tokenCard(token, true))
                .join("");
        } catch (error) {
            renderEmpty(historyContent, "History unavailable", error.message, "cloud_off");
        }
    }

    async function loadQueue(centreId) {
        if (!centreId) {
            renderEmpty(
                queueContent,
                "Choose a centre",
                "Select a healthcare centre to view its queue.",
                "groups"
            );
            return;
        }

        queueContent.innerHTML =
            '<div class="dq-loading">Loading centre queue…</div>';

        try {
            const result = await apiRequest(
                `/centre/${encodeURIComponent(centreId)}`
            );

            const queue = getData(result);

            if (!queue || Array.isArray(queue) || typeof queue !== "object") {
                throw new Error("The server returned an unexpected queue format.");
            }

            const tokens = Array.isArray(queue.tokens) ? queue.tokens : [];
            const current = queue.currentToken;

            const currentLabel = current == null
                ? "—"
                : typeof current === "object"
                    ? tokenLabel(current)
                    : String(current);

            const waitingCount = Number(queue.waitingCount ?? 0);

            queueContent.innerHTML = `
                <div class="dq-queue-stats">
                    <div class="dq-stat-card current">
                        <span>Currently being served</span>
                        <strong>${escapeHTML(currentLabel)}</strong>
                    </div>

                    <div class="dq-stat-card">
                        <span>People waiting</span>
                        <strong>${escapeHTML(waitingCount)}</strong>
                    </div>
                </div>

                <div class="dq-card" style="margin-bottom:14px">
                    <span class="dq-kicker">TODAY'S QUEUE</span>
                    <h3 style="margin:8px 0;color:var(--dq-ink);font-size:15px">
                        ${escapeHTML(
                            centreSelect.querySelector(`option[value="${centreId}"]`)?.textContent ||
                            queueCentreSelect.querySelector(`option[value="${centreId}"]`)?.textContent ||
                            "Healthcare centre"
                        )}
                    </h3>
                    <p style="margin:0;color:var(--dq-muted);font-size:11px">
                        Queue date: ${escapeHTML(formatDate(queue.queueDate))}
                    </p>
                </div>

                <div style="display:grid;gap:10px">
                    ${
                        tokens.length
                            ? tokens.map(token => `
                                <div class="dq-queue-row">
                                    <div>
                                        <strong>${escapeHTML(token.tokenLabel || tokenLabel(token))}</strong>
                                        <small>${escapeHTML(String(token.service_type || "GENERAL_CHECKUP").replace(/_/g, " "))}</small>
                                    </div>
                                    <span class="dq-status status-${escapeHTML(statusClass(token.status))}">
                                        ${escapeHTML(statusLabel(token.status))}
                                    </span>
                                </div>
                            `).join("")
                            : `
                                <div class="dq-empty-state">
                                    <span class="material-icons">event_available</span>
                                    <h3>No tokens in the queue</h3>
                                    <p>There are no tokens to display for this centre today.</p>
                                </div>
                            `
                    }
                </div>
            `;
        } catch (error) {
            renderEmpty(queueContent, "Queue unavailable", error.message, "cloud_off");
        }
    }

    function activatePanel(panelId) {
        hideMessage();

        panels.forEach(panel => {
            panel.hidden = panel.id !== panelId;
        });

        tabs.forEach(tab => {
            const active = tab.dataset.panel === panelId;
            tab.classList.toggle("active", active);
            tab.setAttribute("aria-selected", String(active));
        });

        if (panelId === "myTokenPanel") {
            loadMyTokens().catch(() => {});
        }

        if (panelId === "historyPanel") {
            loadHistory();
        }

        if (panelId === "queuePanel" && queueCentreSelect.value) {
            loadQueue(queueCentreSelect.value);
        }
    }

    tabs.forEach(tab => {
        tab.addEventListener("click", () => {
            activatePanel(tab.dataset.panel);
        });
    });

    document.querySelectorAll("[data-go-panel]").forEach(button => {
        button.addEventListener("click", () => {
            activatePanel(button.dataset.goPanel);
        });
    });

    bookForm.addEventListener("submit", async event => {
        event.preventDefault();
        hideMessage();

        const centreId = Number(centreSelect.value);
        const serviceType = document.getElementById("serviceSelect").value;

        if (!centreId) {
            showMessage("Please choose a healthcare centre.", "error");
            return;
        }

        bookButton.disabled = true;
        bookButton.querySelector("span:last-child").textContent = "Requesting token…";

        try {
            const result = await apiRequest("/book", {
                method: "POST",
                body: JSON.stringify({ centreId, serviceType })
            });

            const created = getData(result);
            showMessage(
                result.message ||
                `Your token request was successful${created?.token_number ? ` — token ${created.token_number}` : ""}.`
            );

            await loadMyTokens(false);
            activatePanel("myTokenPanel");
        } catch (error) {
            showMessage(error.message || "Couldn't book your token.", "error");
        } finally {
            bookButton.disabled = false;
            bookButton.querySelector("span:last-child").textContent = "Get my token";
        }
    });

    document.getElementById("refreshMyTokens").addEventListener("click", () => {
        loadMyTokens().catch(error => showMessage(error.message, "error"));
    });

    document.getElementById("refreshHistory").addEventListener("click", loadHistory);

    document.getElementById("refreshQueue").addEventListener("click", () => {
        loadQueue(queueCentreSelect.value);
    });

    document.getElementById("loadQueueButton").addEventListener("click", () => {
        loadQueue(queueCentreSelect.value);
    });

    queueCentreSelect.addEventListener("change", () => {
        if (queueCentreSelect.value) {
            loadQueue(queueCentreSelect.value);
        }
    });

    document.addEventListener("click", event => {
        const button = event.target.closest("[data-view-queue]");
        if (!button) return;

        const centreId = button.dataset.viewQueue;

        if (centreId) {
            queueCentreSelect.value = centreId;
            activatePanel("queuePanel");
        }
    });

    // Preselect the centre for the most recent token, if available.
    loadMyTokens(false)
        .then(tokens => {
            if (tokens.length) {
                const centreId = tokens[0].centre_id || tokens[0].centreId;

                if (centreId) {
                    centreSelect.value = String(centreId);
                    queueCentreSelect.value = String(centreId);
                }
            }
        })
        .catch(() => {
            // The page remains usable; errors are shown in the relevant panel.
        });
});

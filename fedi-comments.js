document.addEventListener("DOMContentLoaded", function() {
    const idElement = document.querySelector('[data-fedi-id]');
    const wrapper = document.getElementById('fediverse-comments-area');
    if (!idElement || !wrapper) return;

    const fediId = idElement.getAttribute('data-fedi-id');

    function formatDate(dateString) {
        const options = { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' };
        return new Date(dateString).toLocaleDateString('de-DE', options) + " Uhr";
    }

    window.fediRedirect = function(uri) {
        const instance = document.getElementById('fedi-instance-input').value.trim().replace(/^https?:\/\//, '');
        if (!instance) return alert("Bitte Instanz-Domain eingeben.");
        window.open(`https://${instance}/authorize_interaction?uri=${encodeURIComponent(uri)}`, '_blank');
    };

    window.copyFediLink = function() {
        const copyText = document.getElementById("fedi-link-field");
        copyText.select();
        navigator.clipboard.writeText(copyText.value);
        alert("Beitrags-URL kopiert!");
    };

    function renderComment(item, isTopLevel = false) {
        let statsHtml = '';
        if (item.favourites_count > 0 || item.reblogs_count > 0) {
            statsHtml = `<div class="fedi-comment-stats">
            ${item.favourites_count > 0 ? `<span>❤️ ${item.favourites_count}</span>` : ''}
            ${item.reblogs_count > 0 ? `<span>🔄 ${item.reblogs_count}</span>` : ''}
            </div>`;
        }

        return `
        <div class="fedi-comment ${isTopLevel ? 'top-level' : ''}">
        <div style="display: flex; align-items: center; margin-bottom: 0.8rem;">
        <div class="fedi-user-icon" title="Privatsphäre: Avatare deaktiviert">👤</div>
        <div style="line-height: 1.2;">
        <a href="${item.account.url}" class="fedi-author" target="_blank" rel="nofollow noopener">${item.account.display_name}</a>
        <a href="${item.url}" class="fedi-date" target="_blank" rel="nofollow noopener">${formatDate(item.created_at)}</a>
        </div>
        </div>
        <div class="fedi-body">${item.content}</div>
        ${statsHtml}
        ${item.children && item.children.length > 0 ?
            item.children.map(child => renderComment(child)).join('') : ''}
            </div>`;
    }

    fetch(`./fedi-proxy.php?id=${fediId}`)
    .then(response => response.json())
    .then(res => {
        const data = res.details;
        const postInfo = res.post;
        const fediPostUrl = postInfo.url;

        const publicComments = data.descendants.filter(comment =>
        comment.visibility === 'public' || comment.visibility === 'unlisted'
        );

        let html = `
        <div class="fedi-post-stats">
        <span>❤️ ${postInfo.favourites_count} Likes</span>
        <span>🔄 ${postInfo.reblogs_count} Shares</span>
        </div>

        <div class="fedi-interaction-box">
        <h4>Mitdiskutieren</h4>
        <p>Dieser Blog ist mit dem Fediverse verbunden. Du kannst von jedem Server aus antworten (z. B. Mastodon oder Friendica).</p>

        <div style="margin-bottom: 20px;">
        <strong>1. Für Nutzer von Mastodon, Pleroma oder Sharkey:</strong>
        <div class="fedi-helper-row">
        <input type="text" id="fedi-instance-input" class="fedi-input" placeholder="Deine Instanz (z. B. mastodon.social)" onkeydown="if(event.key==='Enter') fediRedirect('${fediPostUrl}')">
        <button class="fedi-button" onclick="fediRedirect('${fediPostUrl}')">LOS!</button>
        </div>
        </div>

        <div style="border-top: 1px solid #444; padding-top: 15px;">
        <strong>2. Für Friendica, Hubzilla & andere:</strong>
        <p>Kopiere diese URL in das Suchfeld deiner Instanz, um den Beitrag zu finden:</p>
        <div style="display: flex; gap: 5px;">
        <input type="text" id="fedi-link-field" class="fedi-input" value="${fediPostUrl}" readonly style="font-family: monospace; background: #000; font-size: 0.8rem; flex-grow: 1;">
        <button class="fedi-button" onclick="copyFediLink()" style="background: #555;">KOPIEREN</button>
        </div>
        </div>

        <div class="fedi-privacy-notice">
        <strong>Hinweis zum Datenschutz:</strong> Sämtliche Interaktionen (Kommentare, Likes, Shares) werden live aus dem Fediverse geladen und zu keinem Zeitpunkt auf diesem Blog-Server gespeichert. Wenn du deinen Beitrag oder deine Interaktion auf deiner Heimat-Instanz löschst, verschwindet sie automatisch auch hier. Du behältst die volle Souveränität über deine Daten.
        </div>
        </div>

        <h3>Diskussion (${publicComments.length})</h3>
        `;

        if (publicComments.length > 0) {
            const commentMap = {};
            publicComments.forEach(d => { commentMap[d.id] = { ...d, children: [] }; });
            const tree = [];
            publicComments.forEach(d => {
                const parentId = d.in_reply_to_id;
                if (parentId && commentMap[parentId]) {
                    commentMap[parentId].children.push(commentMap[d.id]);
                } else {
                    tree.push(commentMap[d.id]);
                }
            });
            html += tree.map(item => renderComment(item, true)).join('');
            wrapper.innerHTML = html;
        } else {
            wrapper.innerHTML = html + "<p>Bisher noch keine öffentlichen Antworten vorhanden.</p>";
        }
    })
    .catch(err => {
        wrapper.innerHTML = "";
    });
});

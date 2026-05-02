javascript:(function(){
    if(window.__MDS) { alert('Dev Suite already loaded!'); return; }
    window.__MDS = 1;

    if(!confirm('Enable Dev Suite?')) return;

    // ==================== MAIN PANEL ====================
    const sheet = document.createElement('div');
    Object.assign(sheet.style, {
        position: 'fixed', left: '0', bottom: '-100%',
        width: '100%', height: '70%',
        background: '#111', color: '#fff',
        zIndex: 999999, transition: '0.4s cubic-bezier(0.32,0.72,0,1)',
        borderTopLeftRadius: '24px', borderTopRightRadius: '24px',
        display: 'flex', flexDirection: 'column',
        boxShadow: '0 -4px 30px rgba(0,0,0,0.6)',
        overflow: 'hidden'
    });

    sheet.innerHTML = `
        <div style="padding:14px 20px;background:#1f1f1f;text-align:center;font-weight:bold;border-bottom:1px solid #333;">DEV SUITE ⚡️</div>
        <div id="tabs" style="display:flex;gap:4px;padding:8px 6px;overflow-x:auto;background:#1a1a1a;">
            <button data-tab="inspect" style="padding:8px 16px;border-radius:999px;white-space:nowrap;">Inspect</button>
            <button data-tab="dom" style="padding:8px 16px;border-radius:999px;white-space:nowrap;">DOM</button>
            <button data-tab="css" style="padding:8px 16px;border-radius:999px;white-space:nowrap;">CSS</button>
            <button data-tab="js" style="padding:8px 16px;border-radius:999px;white-space:nowrap;">JS</button>
            <button data-tab="tools" style="padding:8px 16px;border-radius:999px;white-space:nowrap;">Tools</button>
        </div>
        <div id="view" style="flex:1;overflow:auto;padding:16px;background:#111;"></div>
        <div style="display:flex;gap:8px;padding:12px;background:#1f1f1f;">
            <button id="freeze" style="flex:1;padding:12px;border-radius:999px;">Freeze</button>
            <button id="reload" style="flex:1;padding:12px;border-radius:999px;">Reload</button>
            <button id="close" style="flex:1;padding:12px;border-radius:999px;">Close</button>
        </div>
    `;

    document.body.appendChild(sheet);

    // ==================== FLOATING BUTTON ====================
    const btn = document.createElement('div');
    btn.innerHTML = '👹';
    Object.assign(btn.style, {
        position: 'fixed', bottom: '80px', right: '20px',
        width: '64px', height: '64px',
        borderRadius: '50%',
        background: '#000',
        color: '#fff',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: '28px',
        zIndex: 999999,
        boxShadow: '0 4px 20px rgba(0,0,0,0.5)',
        touchAction: 'none',
        userSelect: 'none'
    });
    document.body.appendChild(btn);

    // ==================== CONTROLS ====================
    let open = false;

    function togglePanel() {
        open = !open;
        sheet.style.bottom = open ? '0' : '-100%';
    }

    btn.addEventListener('click', togglePanel);

    // Double tap = Inspect
    let lastTap = 0;
    btn.addEventListener('touchend', (e) => {
        const now = Date.now();
        if (now - lastTap < 300) {
            if (typeof startInspect === "function") startInspect();
        }
        lastTap = now;
    });

    sheet.querySelector('#close').onclick = () => {
        sheet.style.bottom = '-100%';
        open = false;
    };

    // Reload button
    sheet.querySelector('#reload').onclick = () => location.reload();

    // ==================== INSPECT MODE ====================
    let inspecting = false;
    let hl = null;
    let selectedEl = null;

    window.startInspect = function() {
        if (inspecting) return;
        inspecting = true;

        hl = document.createElement('div');
        Object.assign(hl.style, {
            position: 'fixed',
            border: '3px solid #00ff9d',
            background: 'rgba(0,255,157,0.12)',
            pointerEvents: 'none',
            zIndex: 999998,
            borderRadius: '4px'
        });
        document.body.appendChild(hl);

        document.addEventListener('touchstart', pickElement, true);
        alert('👹 Tap any element to inspect');
    };

    function pickElement(e) {
        if (!inspecting) return;
        e.preventDefault();
        e.stopImmediatePropagation();

        selectedEl = e.target;
        const rect = selectedEl.getBoundingClientRect();

        Object.assign(hl.style, {
            top: rect.top + 'px',
            left: rect.left + 'px',
            width: rect.width + 'px',
            height: rect.height + 'px'
        });

        inspecting = false;
        document.removeEventListener('touchstart', pickElement, true);
        setTimeout(() => hl.remove(), 1200);

        // Show in DOM tab
        showDOM();
    }

    function showDOM() {
        if (!selectedEl) return;
        const view = sheet.querySelector('#view');
        view.innerHTML = `
            <strong>Selected:</strong> ${selectedEl.tagName.toLowerCase()}<br><br>
            <textarea id="domEdit" style="width:100%;height:55%;font-family:monospace;font-size:13px;">${esc(selectedEl.outerHTML)}</textarea><br>
            <button id="applyDom" style="padding:12px 24px;border-radius:999px;">Apply Changes</button>
        `;

        view.querySelector('#applyDom').onclick = () => {
            try {
                const tmp = document.createElement('div');
                tmp.innerHTML = view.querySelector('#domEdit').value;
                selectedEl.replaceWith(tmp.firstElementChild);
                alert('✅ Applied!');
            } catch(e) { alert('Error: ' + e.message); }
        };
    }

    function esc(s) {
        return s.replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
    }

    alert('✅ Dev Suite Loaded!\n\nTap the 👹 button to open.\nDouble-tap 👹 for Inspect mode.');

})();

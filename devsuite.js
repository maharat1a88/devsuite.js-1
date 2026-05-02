(function(){
    if(window.__MDS) return;
    window.__MDS = 1;

    if(!confirm('Enable Dev Suite?')) return;

    // ==================== PANEL ====================
    const sheet = document.createElement('div');
    Object.assign(sheet.style, {
        position:'fixed', left:'0', bottom:'-100%',
        width:'100%', height:'68%',
        background:'#111', color:'#fff',
        zIndex:999999, transition:'0.4s cubic-bezier(0.32,0.72,0,1)',
        borderTopLeftRadius:'24px', borderTopRightRadius:'24px',
        display:'flex', flexDirection:'column',
        boxShadow:'0 -4px 30px rgba(0,0,0,0.6)'
    });

    sheet.innerHTML = `
        <div style="padding:14px;background:#1f1f1f;text-align:center;font-weight:bold;">DEV SUITE ⚡️</div>
        <div id="tabs" style="display:flex;gap:6px;padding:8px;overflow-x:auto;background:#1a1a1a;">
            <button data-tab="inspect" style="padding:8px 16px;border-radius:999px;white-space:nowrap;">Inspect</button>
            <button data-tab="dom" style="padding:8px 16px;border-radius:999px;white-space:nowrap;">DOM</button>
            <button data-tab="tools" style="padding:8px 16px;border-radius:999px;white-space:nowrap;">Tools</button>
        </div>
        <div id="view" style="flex:1;overflow:auto;padding:16px;"></div>
        <div style="display:flex;gap:8px;padding:12px;background:#1f1f1f;">
            <button id="reload" style="flex:1;padding:12px;border-radius:999px;">Reload</button>
            <button id="close" style="flex:1;padding:12px;border-radius:999px;">Close</button>
        </div>
    `;
    document.body.appendChild(sheet);

    // ==================== FLOAT BUTTON ====================
    const btn = document.createElement('div');
    btn.innerHTML = '👹';
    Object.assign(btn.style, {
        position:'fixed', bottom:'80px', right:'20px',
        width:'64px', height:'64px',
        borderRadius:'50%', background:'#000', color:'#fff',
        display:'flex', alignItems:'center', justifyContent:'center',
        fontSize:'28px', zIndex:999999,
        boxShadow:'0 4px 20px rgba(0,0,0,0.5)',
        touchAction:'none'
    });
    document.body.appendChild(btn);

    // Controls
    let open = false;
    btn.onclick = () => { open = !open; sheet.style.bottom = open ? '0' : '-100%'; };
    sheet.querySelector('#close').onclick = () => { sheet.style.bottom = '-100%'; open = false; };
    sheet.querySelector('#reload').onclick = () => location.reload();

    // Inspect Mode
    let inspecting = false, hl = null, selected = null;

    window.startInspect = function(){
        inspecting = true;
        hl = document.createElement('div');
        Object.assign(hl.style, {
            position:'fixed', border:'3px solid #00ff9d',
            background:'rgba(0,255,157,0.15)', pointerEvents:'none',
            zIndex:999998, borderRadius:'6px'
        });
        document.body.appendChild(hl);
        document.addEventListener('touchstart', pick, true);
        alert('👹 Tap any element to inspect');
    };

    function pick(e){
        if(!inspecting) return;
        e.preventDefault(); e.stopImmediatePropagation();
        selected = e.target;
        const r = selected.getBoundingClientRect();
        Object.assign(hl.style, {top:r.top+'px', left:r.left+'px', width:r.width+'px', height:r.height+'px'});
        inspecting = false;
        document.removeEventListener('touchstart', pick, true);
        setTimeout(() => hl.remove(), 1500);
        showDOM();
    }

    function showDOM(){
        if(!selected) return;
        const v = sheet.querySelector('#view');
        v.innerHTML = `
            <strong>Element:</strong> ${selected.tagName}<br><br>
            <textarea id="edit" style="width:100%;height:55%;font-family:monospace;font-size:13px;background:#222;color:#0f0;border:1px solid #333;">${selected.outerHTML.replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]))}</textarea><br>
            <button id="apply" style="padding:12px 24px;border-radius:999px;">Apply Changes</button>
        `;
        v.querySelector('#apply').onclick = () => {
            try {
                const tmp = document.createElement('div');
                tmp.innerHTML = v.querySelector('#edit').value;
                selected.replaceWith(tmp.firstElementChild);
                alert('✅ Applied!');
            } catch(err){ alert('Error'); }
        };
    }

    // Double tap on button = Inspect
    let lastTap = 0;
    btn.addEventListener('touchend', () => {
        const now = Date.now();
        if(now - lastTap < 300) startInspect();
        lastTap = now;
    });

    alert('✅ Dev Suite Loaded!\n\nTap 👹 to open | Double-tap 👹 for Inspect');
})();

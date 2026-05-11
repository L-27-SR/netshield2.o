<script>
  import { onMount, tick } from 'svelte';

  // ─── STATE ───────────────────────────────────────────────────────────────────
  let activeTab = 'network';   // network | chat | tls | firewall | logs
  let logs = [];
  let packets = [];
  let packetId = 0;

  // Crypto state
  let aesKey = null;
  let rsaKeyPairA = null;
  let rsaKeyPairB = null;
  let rsaKeysReady = false;
  let cryptoReady = false;

  // Network nodes
  const NODES = {
    A: { id: 'A', label: 'Alice', x: 120, y: 220, color: '#4ade80', role: 'client' },
    R1: { id: 'R1', label: 'Router 1', x: 300, y: 140, color: '#60a5fa', role: 'router' },
    R2: { id: 'R2', label: 'Router 2', x: 300, y: 300, color: '#60a5fa', role: 'router' },
    FW: { id: 'FW', label: 'Firewall', x: 480, y: 220, color: '#f59e0b', role: 'firewall' },
    B: { id: 'B', label: 'Bob', x: 660, y: 220, color: '#a78bfa', role: 'server' },
    M: { id: 'M', label: 'Mallory\n(MITM)', x: 300, y: 220, color: '#f87171', role: 'mitm' },
  };

  const EDGES = [
    { from: 'A', to: 'R1' }, { from: 'A', to: 'R2' },
    { from: 'R1', to: 'FW' }, { from: 'R2', to: 'FW' },
    { from: 'FW', to: 'B' },
  ];

  // Modes
  let mitmEnabled = false;
  let snifferEnabled = false;

  // Firewall rules
  let firewallRules = [
    { id: 1, proto: 'TCP', port: 443, action: 'ALLOW', active: true },
    { id: 2, proto: 'TCP', port: 80,  action: 'BLOCK', active: true },
    { id: 3, proto: 'UDP', port: 53,  action: 'ALLOW', active: true },
    { id: 4, proto: 'TCP', port: 22,  action: 'BLOCK', active: true },
  ];
  let newRule = { proto: 'TCP', port: '', action: 'ALLOW' };

  // Chat
  let chatInput = '';
  let chatMessages = [];
  let encryptChat = true;
  let chatRoute = 'R1';

  // TLS handshake
  let tlsSteps = [];
  let tlsRunning = false;
  let tlsComplete = false;
  let tlsSession = null;

  // RSA display
  let rsaPublicA = '';
  let rsaPublicB = '';
  let rsaEncrypted = '';
  let rsaDecrypted = '';
  let rsaInput = 'Hello RSA!';

  // Animated packet trail
  let animating = [];

  // ─── LOGGING ─────────────────────────────────────────────────────────────────
  function log(msg, type = 'info') {
    const ts = new Date().toLocaleTimeString();
    logs = [{ ts, msg, type }, ...logs].slice(0, 120);
  }

  // ─── CRYPTO INIT ─────────────────────────────────────────────────────────────
  async function initCrypto() {
    log('Generating AES-256-GCM session key…', 'system');
    aesKey = await crypto.subtle.generateKey({ name: 'AES-GCM', length: 256 }, true, ['encrypt', 'decrypt']);
    log('AES-256-GCM key ready ✓', 'success');

    log('Generating RSA-OAEP key pairs (2048-bit) for Alice & Bob…', 'system');
    [rsaKeyPairA, rsaKeyPairB] = await Promise.all([
      crypto.subtle.generateKey({ name: 'RSA-OAEP', modulusLength: 2048, publicExponent: new Uint8Array([1,0,1]), hash: 'SHA-256' }, true, ['encrypt', 'decrypt']),
      crypto.subtle.generateKey({ name: 'RSA-OAEP', modulusLength: 2048, publicExponent: new Uint8Array([1,0,1]), hash: 'SHA-256' }, true, ['encrypt', 'decrypt']),
    ]);
    rsaKeysReady = true;

    // Export public keys for display
    const expA = await crypto.subtle.exportKey('spki', rsaKeyPairA.publicKey);
    const expB = await crypto.subtle.exportKey('spki', rsaKeyPairB.publicKey);
    rsaPublicA = btoa(String.fromCharCode(...new Uint8Array(expA))).slice(0, 64) + '…';
    rsaPublicB = btoa(String.fromCharCode(...new Uint8Array(expB))).slice(0, 64) + '…';
    log('RSA-OAEP key pairs ready ✓', 'success');
    cryptoReady = true;
    log('Crypto subsystem online. All modules ready.', 'success');
  }

  // ─── AES ENCRYPT / DECRYPT ────────────────────────────────────────────────
  async function aesEncrypt(plaintext) {
    const iv = crypto.getRandomValues(new Uint8Array(12));
    const enc = new TextEncoder();
    const ct = await crypto.subtle.encrypt({ name: 'AES-GCM', iv }, aesKey, enc.encode(plaintext));
    return { iv: Array.from(iv), ct: Array.from(new Uint8Array(ct)) };
  }

  async function aesDecrypt({ iv, ct }) {
    const dec = new TextDecoder();
    const plain = await crypto.subtle.decrypt(
      { name: 'AES-GCM', iv: new Uint8Array(iv) }, aesKey, new Uint8Array(ct)
    );
    return dec.decode(plain);
  }

  // ─── RSA ENCRYPT / DECRYPT ───────────────────────────────────────────────
  async function rsaEncrypt(text) {
    const enc = new TextEncoder();
    const ct = await crypto.subtle.encrypt({ name: 'RSA-OAEP' }, rsaKeyPairB.publicKey, enc.encode(text));
    return btoa(String.fromCharCode(...new Uint8Array(ct)));
  }

  async function rsaDecrypt(b64) {
    const bytes = Uint8Array.from(atob(b64), c => c.charCodeAt(0));
    const dec = new TextDecoder();
    const plain = await crypto.subtle.decrypt({ name: 'RSA-OAEP' }, rsaKeyPairB.privateKey, bytes);
    return dec.decode(plain);
  }

  // ─── RSA DEMO ─────────────────────────────────────────────────────────────
  async function doRsaDemo() {
    if (!rsaKeysReady) return;
    log(`RSA encrypt: "${rsaInput}" → Bob's public key`, 'crypto');
    rsaEncrypted = await rsaEncrypt(rsaInput);
    log(`Ciphertext (truncated): ${rsaEncrypted.slice(0, 40)}…`, 'crypto');
    rsaDecrypted = await rsaDecrypt(rsaEncrypted);
    log(`RSA decrypt → "${rsaDecrypted}" ✓`, 'success');
  }

  // ─── PACKET ROUTING ──────────────────────────────────────────────────────
  function fwCheck(proto, port) {
    for (const r of firewallRules) {
      if (!r.active) continue;
      if (r.proto === proto && r.port === Number(port)) return r.action;
    }
    return 'ALLOW';
  }

  async function sendPacket(text, proto = 'TCP', port = 443, forceEncrypt = true) {
    if (!cryptoReady) { log('Crypto not ready', 'warn'); return; }

    const route = mitmEnabled
      ? ['A', chatRoute, 'M', 'FW', 'B']
      : ['A', chatRoute, 'FW', 'B'];

    let payload;
    let encrypted = false;

    if (forceEncrypt && encryptChat) {
      const { iv, ct } = await aesEncrypt(text);
      payload = { encrypted: true, iv, ct };
      encrypted = true;
      log(`[ENCRYPT] AES-GCM → ${ct.length} bytes ciphertext`, 'crypto');
    } else {
      payload = { encrypted: false, text };
    }

    const fw = fwCheck(proto, port);
    if (fw === 'BLOCK') {
      log(`[FIREWALL] BLOCKED ${proto}:${port} — rule match`, 'danger');
      flashNode('FW', '#ef4444');
      return;
    }

    const pid = ++packetId;
    log(`[PKT #${pid}] ${proto}:${port} | ${route.join(' → ')} | ${encrypted ? '🔒 encrypted' : '⚠ plaintext'}`, 'info');

    if (snifferEnabled && !encrypted) {
      log(`[SNIFFER] 👁 Plaintext captured: "${text}"`, 'danger');
    } else if (snifferEnabled && encrypted) {
      log(`[SNIFFER] 👁 Captured ciphertext (unreadable): ${JSON.stringify(payload).slice(0, 50)}…`, 'warn');
    }

    await animatePacket(route, pid, encrypted);

    if (mitmEnabled) {
      log(`[MITM] Mallory intercepted packet #${pid}! Payload tampered.`, 'danger');
      flashNode('M', '#ef4444');
      payload = { encrypted: false, text: '[TAMPERED by Mallory]' };
      encrypted = false;
    }

    log(`[FIREWALL] ${fw} ${proto}:${port}`, fw === 'ALLOW' ? 'success' : 'danger');

    if (encrypted && payload.encrypted) {
      const plain = await aesDecrypt(payload);
      return plain;
    }
    return payload.text || '[tampered]';
  }

  // ─── PACKET ANIMATION ────────────────────────────────────────────────────
  function nodePos(id) {
    const n = NODES[id];
    return { x: n.x, y: n.y };
  }

  async function animatePacket(route, pid, encrypted) {
    for (let i = 0; i < route.length - 1; i++) {
      const from = nodePos(route[i]);
      const to = nodePos(route[i + 1]);
      const id = `${pid}-${i}`;
      animating = [...animating, { id, x: from.x, y: from.y, tx: to.x, ty: to.y, encrypted }];
      await new Promise(r => setTimeout(r, 380));
      animating = animating.filter(a => a.id !== id);
      flashNode(route[i + 1], encrypted ? '#4ade80' : '#f87171');
    }
  }

  let flashNodes = {};
  function flashNode(id, color) {
    flashNodes = { ...flashNodes, [id]: color };
    setTimeout(() => {
      const n = { ...flashNodes };
      delete n[id];
      flashNodes = n;
    }, 500);
  }

  // ─── CHAT ────────────────────────────────────────────────────────────────
  async function sendChat() {
    if (!chatInput.trim() || !cryptoReady) return;
    const msg = chatInput.trim();
    chatInput = '';
    chatMessages = [...chatMessages, { from: 'Alice', text: msg, enc: encryptChat, ts: new Date().toLocaleTimeString() }];
    const received = await sendPacket(msg, 'TCP', 443, encryptChat);
    chatMessages = [...chatMessages, { from: 'Bob', text: received, enc: encryptChat, ts: new Date().toLocaleTimeString() }];
  }

  function handleKey(e) { if (e.key === 'Enter') sendChat(); }

  // ─── TLS HANDSHAKE ───────────────────────────────────────────────────────
  const TLS_STEPS_DEF = [
    { label: 'Client Hello', from: 'Alice', to: 'Bob', detail: 'TLS 1.3, cipher suites: TLS_AES_256_GCM_SHA384, supported groups, random nonce', color: '#60a5fa' },
    { label: 'Server Hello', from: 'Bob', to: 'Alice', detail: 'Selected cipher: TLS_AES_256_GCM_SHA384, server random, session ID', color: '#a78bfa' },
    { label: 'Certificate', from: 'Bob', to: 'Alice', detail: 'X.509 cert chain, RSA-2048 public key, signed by CA', color: '#a78bfa' },
    { label: 'Certificate Verify', from: 'Bob', to: 'Alice', detail: 'Digital signature over handshake transcript (SHA-256)', color: '#a78bfa' },
    { label: 'Finished (Server)', from: 'Bob', to: 'Alice', detail: 'HMAC over all handshake messages — proves integrity', color: '#a78bfa' },
    { label: 'Pre-Master Secret', from: 'Alice', to: 'Bob', detail: 'RSA-OAEP encrypted random value → derive master secret', color: '#60a5fa' },
    { label: 'Key Derivation', from: 'Both', to: 'Both', detail: 'PRF(master_secret, label, seed) → write_key + write_IV (both sides)', color: '#f59e0b' },
    { label: 'Change Cipher Spec', from: 'Alice', to: 'Bob', detail: 'Switch to negotiated cipher suite', color: '#60a5fa' },
    { label: 'Finished (Client)', from: 'Alice', to: 'Bob', detail: 'HMAC over all handshake messages — mutual auth complete', color: '#60a5fa' },
    { label: '🔐 Secure Channel Established', from: 'Both', to: 'Both', detail: 'Application data flows encrypted with AES-256-GCM', color: '#4ade80' },
  ];

  async function runTLS() {
    if (tlsRunning) return;
    tlsRunning = true;
    tlsSteps = [];
    tlsComplete = false;
    tlsSession = null;
    log('[TLS] Starting TLS 1.3 handshake simulation…', 'system');

    for (const step of TLS_STEPS_DEF) {
      await new Promise(r => setTimeout(r, 700));
      tlsSteps = [...tlsSteps, { ...step, done: true }];
      log(`[TLS] ${step.label}: ${step.detail.slice(0, 60)}…`, 'crypto');
    }

    tlsComplete = true;
    tlsSession = {
      cipher: 'TLS_AES_256_GCM_SHA384',
      version: 'TLS 1.3',
      resumed: false,
    };
    log('[TLS] Handshake complete. Secure session established ✓', 'success');
    tlsRunning = false;
  }

  // ─── FIREWALL ─────────────────────────────────────────────────────────────
  function addRule() {
    if (!newRule.port) return;
    firewallRules = [...firewallRules, { ...newRule, id: Date.now(), port: Number(newRule.port), active: true }];
    log(`[FW] Rule added: ${newRule.action} ${newRule.proto}:${newRule.port}`, 'system');
    newRule = { proto: 'TCP', port: '', action: 'ALLOW' };
  }

  function deleteRule(id) {
    firewallRules = firewallRules.filter(r => r.id !== id);
  }

  function toggleRule(id) {
    firewallRules = firewallRules.map(r => r.id === id ? { ...r, active: !r.active } : r);
  }

  // ─── INIT ─────────────────────────────────────────────────────────────────
  onMount(() => { initCrypto(); });
</script>

<style>
  @import url('https://fonts.googleapis.com/css2?family=Share+Tech+Mono&family=Exo+2:wght@300;400;600;700&display=swap');

  :global(body) { margin: 0; background: #060b14; }

  * { box-sizing: border-box; }

  .app {
    min-height: 100vh;
    background: #060b14;
    color: #c8d6e5;
    font-family: 'Exo 2', sans-serif;
    display: flex;
    flex-direction: column;
  }

  /* ── Header ── */
  .header {
    background: linear-gradient(135deg, #0d1b2a 0%, #0a1628 100%);
    border-bottom: 1px solid #1e3a5f44;
    padding: 16px 28px;
    display: flex;
    align-items: center;
    gap: 20px;
  }

  .logo {
    font-family: 'Share Tech Mono', monospace;
    font-size: 18px;
    color: #4ade80;
    letter-spacing: 2px;
    text-transform: uppercase;
  }

  .logo span { color: #60a5fa; }

  .status-badges {
    display: flex;
    gap: 10px;
    margin-left: auto;
    align-items: center;
    flex-wrap: wrap;
  }

  .badge {
    font-family: 'Share Tech Mono', monospace;
    font-size: 11px;
    padding: 4px 10px;
    border-radius: 4px;
    border: 1px solid currentColor;
    letter-spacing: 1px;
  }

  .badge.green { color: #4ade80; background: #4ade8010; }
  .badge.red   { color: #f87171; background: #f8717110; }
  .badge.amber { color: #fbbf24; background: #fbbf2410; }
  .badge.blue  { color: #60a5fa; background: #60a5fa10; }

  .toggle-btn {
    font-family: 'Share Tech Mono', monospace;
    font-size: 11px;
    padding: 5px 12px;
    border-radius: 4px;
    border: 1px solid;
    cursor: pointer;
    letter-spacing: 1px;
    transition: all 0.2s;
  }

  .toggle-btn.mitm { border-color: #f87171; color: #f87171; background: transparent; }
  .toggle-btn.mitm.on { background: #f87171; color: #060b14; }
  .toggle-btn.sniffer { border-color: #fbbf24; color: #fbbf24; background: transparent; }
  .toggle-btn.sniffer.on { background: #fbbf24; color: #060b14; }

  /* ── Tabs ── */
  .tabs {
    display: flex;
    gap: 2px;
    background: #0a1322;
    border-bottom: 1px solid #1e3a5f44;
    padding: 0 20px;
  }

  .tab {
    font-family: 'Share Tech Mono', monospace;
    font-size: 12px;
    letter-spacing: 1.5px;
    padding: 12px 18px;
    cursor: pointer;
    border-bottom: 2px solid transparent;
    color: #4a6a8a;
    transition: all 0.2s;
    background: none;
    border-top: none;
    border-left: none;
    border-right: none;
    text-transform: uppercase;
  }

  .tab:hover { color: #8ab4d4; }
  .tab.active { color: #4ade80; border-bottom-color: #4ade80; }

  /* ── Body ── */
  .body {
    flex: 1;
    display: grid;
    grid-template-columns: 1fr 320px;
    min-height: 0;
  }

  .main-panel {
    padding: 20px;
    overflow-y: auto;
    min-height: 0;
  }

  /* ── Log sidebar ── */
  .log-panel {
    background: #07101d;
    border-left: 1px solid #1e3a5f44;
    display: flex;
    flex-direction: column;
    overflow: hidden;
  }

  .log-header {
    font-family: 'Share Tech Mono', monospace;
    font-size: 11px;
    color: #4a6a8a;
    letter-spacing: 2px;
    padding: 12px 14px 8px;
    border-bottom: 1px solid #1e3a5f33;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .log-clear {
    font-size: 10px;
    color: #4a6a8a;
    cursor: pointer;
    background: none;
    border: none;
    padding: 0;
    font-family: 'Share Tech Mono', monospace;
    letter-spacing: 1px;
  }

  .log-clear:hover { color: #f87171; }

  .log-entries {
    flex: 1;
    overflow-y: auto;
    padding: 8px 0;
    font-family: 'Share Tech Mono', monospace;
    font-size: 11px;
    line-height: 1.6;
  }

  .log-entry {
    padding: 3px 14px;
    display: flex;
    gap: 8px;
    border-left: 2px solid transparent;
  }

  .log-entry.info   { color: #6a8aaa; border-left-color: #1e3a5f; }
  .log-entry.success { color: #4ade80; border-left-color: #4ade8044; }
  .log-entry.warn   { color: #fbbf24; border-left-color: #fbbf2444; }
  .log-entry.danger { color: #f87171; border-left-color: #f8717144; }
  .log-entry.crypto { color: #a78bfa; border-left-color: #a78bfa44; }
  .log-entry.system { color: #60a5fa; border-left-color: #60a5fa44; }

  .log-ts { opacity: 0.5; white-space: nowrap; flex-shrink: 0; }
  .log-msg { word-break: break-all; }

  /* ── Section titles ── */
  .section-title {
    font-family: 'Share Tech Mono', monospace;
    font-size: 12px;
    letter-spacing: 3px;
    color: #4a6a8a;
    text-transform: uppercase;
    margin: 0 0 14px;
    padding-bottom: 8px;
    border-bottom: 1px solid #1e3a5f44;
  }

  /* ── Network SVG ── */
  .network-svg {
    width: 100%;
    background: #07101d;
    border: 1px solid #1e3a5f44;
    border-radius: 8px;
    margin-bottom: 18px;
  }

  .node-circle {
    filter: drop-shadow(0 0 8px currentColor);
    transition: r 0.2s;
  }

  .packet-dot {
    pointer-events: none;
    transition: cx 0.35s linear, cy 0.35s linear;
  }

  /* ── Cards ── */
  .card {
    background: #0c1828;
    border: 1px solid #1e3a5f55;
    border-radius: 8px;
    padding: 16px 18px;
    margin-bottom: 14px;
  }

  .card-title {
    font-family: 'Share Tech Mono', monospace;
    font-size: 12px;
    letter-spacing: 2px;
    color: #60a5fa;
    margin: 0 0 10px;
    text-transform: uppercase;
  }

  /* ── Controls ── */
  .controls-row {
    display: flex;
    gap: 10px;
    align-items: center;
    flex-wrap: wrap;
    margin-bottom: 12px;
  }

  .btn {
    font-family: 'Share Tech Mono', monospace;
    font-size: 12px;
    letter-spacing: 1px;
    padding: 8px 16px;
    border-radius: 4px;
    border: 1px solid;
    cursor: pointer;
    transition: all 0.2s;
    background: transparent;
  }

  .btn-green  { border-color: #4ade80; color: #4ade80; }
  .btn-green:hover  { background: #4ade80; color: #060b14; }
  .btn-blue   { border-color: #60a5fa; color: #60a5fa; }
  .btn-blue:hover   { background: #60a5fa; color: #060b14; }
  .btn-purple { border-color: #a78bfa; color: #a78bfa; }
  .btn-purple:hover { background: #a78bfa; color: #060b14; }
  .btn-amber  { border-color: #fbbf24; color: #fbbf24; }
  .btn-amber:hover  { background: #fbbf24; color: #060b14; }
  .btn-red    { border-color: #f87171; color: #f87171; }
  .btn-red:hover    { background: #f87171; color: #060b14; }
  .btn-sm { padding: 5px 10px; font-size: 11px; }
  .btn:disabled { opacity: 0.4; cursor: not-allowed; }

  .select, .input {
    font-family: 'Share Tech Mono', monospace;
    font-size: 12px;
    background: #0a1628;
    border: 1px solid #1e3a5f88;
    color: #c8d6e5;
    border-radius: 4px;
    padding: 7px 10px;
    outline: none;
    letter-spacing: 1px;
  }

  .select:focus, .input:focus { border-color: #60a5fa88; }

  .input-row {
    display: flex;
    gap: 8px;
    align-items: stretch;
  }

  .input-row .input { flex: 1; }

  /* ── TLS ── */
  .tls-timeline {
    display: flex;
    flex-direction: column;
    gap: 0;
    position: relative;
  }

  .tls-step {
    display: grid;
    grid-template-columns: 1fr 60px 1fr;
    gap: 8px;
    align-items: center;
    padding: 8px 0;
    border-bottom: 1px solid #1e3a5f22;
    animation: fadeIn 0.3s ease;
  }

  @keyframes fadeIn { from { opacity: 0; transform: translateY(-4px); } to { opacity: 1; transform: none; } }

  .tls-label {
    font-family: 'Share Tech Mono', monospace;
    font-size: 11px;
    letter-spacing: 1px;
    font-weight: 600;
  }

  .tls-detail {
    font-size: 11px;
    color: #4a6a8a;
    margin-top: 2px;
    line-height: 1.5;
  }

  .tls-arrow {
    text-align: center;
    font-size: 18px;
  }

  .tls-alice { text-align: right; }
  .tls-bob   { text-align: left; }
  .tls-both  { text-align: center; grid-column: 1/-1; }

  /* ── Chat ── */
  .chat-messages {
    background: #07101d;
    border: 1px solid #1e3a5f44;
    border-radius: 8px;
    padding: 12px;
    height: 280px;
    overflow-y: auto;
    display: flex;
    flex-direction: column;
    gap: 10px;
    margin-bottom: 12px;
  }

  .chat-msg {
    display: flex;
    flex-direction: column;
    max-width: 75%;
  }

  .chat-msg.alice { align-self: flex-end; align-items: flex-end; }
  .chat-msg.bob   { align-self: flex-start; align-items: flex-start; }

  .chat-bubble {
    padding: 8px 12px;
    border-radius: 8px;
    font-size: 13px;
    line-height: 1.5;
  }

  .chat-msg.alice .chat-bubble { background: #1a3a5f; border: 1px solid #2a5a8f44; }
  .chat-msg.bob   .chat-bubble { background: #1a2a3f; border: 1px solid #2a3a5f44; }

  .chat-meta {
    font-family: 'Share Tech Mono', monospace;
    font-size: 10px;
    color: #4a6a8a;
    margin-top: 3px;
    display: flex;
    gap: 6px;
    align-items: center;
  }

  .enc-badge {
    font-size: 9px;
    padding: 1px 5px;
    border-radius: 3px;
    border: 1px solid #4ade8044;
    color: #4ade80;
    background: #4ade8010;
  }

  /* ── Firewall table ── */
  .fw-table {
    width: 100%;
    border-collapse: collapse;
    font-family: 'Share Tech Mono', monospace;
    font-size: 12px;
  }

  .fw-table th {
    color: #4a6a8a;
    text-align: left;
    padding: 6px 10px;
    border-bottom: 1px solid #1e3a5f55;
    letter-spacing: 1px;
    font-size: 11px;
  }

  .fw-table td {
    padding: 8px 10px;
    border-bottom: 1px solid #1e3a5f22;
    vertical-align: middle;
  }

  .fw-table tr:hover td { background: #1e3a5f11; }

  .rule-badge {
    display: inline-block;
    padding: 2px 8px;
    border-radius: 3px;
    font-size: 11px;
    letter-spacing: 1px;
    font-weight: 700;
  }

  .rule-badge.allow { background: #4ade8020; color: #4ade80; border: 1px solid #4ade8033; }
  .rule-badge.block { background: #f8717120; color: #f87171; border: 1px solid #f8717133; }

  /* ── RSA panel ── */
  .mono-box {
    font-family: 'Share Tech Mono', monospace;
    font-size: 11px;
    background: #07101d;
    border: 1px solid #1e3a5f44;
    border-radius: 6px;
    padding: 10px 12px;
    word-break: break-all;
    line-height: 1.7;
    color: #a78bfa;
    margin-bottom: 10px;
  }

  .mono-box.green { color: #4ade80; }
  .mono-box.amber { color: #fbbf24; }

  .grid2 { display: grid; grid-template-columns: 1fr 1fr; gap: 14px; }

  /* ── Scrollbar ── */
  ::-webkit-scrollbar { width: 5px; height: 5px; }
  ::-webkit-scrollbar-track { background: transparent; }
  ::-webkit-scrollbar-thumb { background: #1e3a5f; border-radius: 3px; }

  /* ── Responsive ── */
  @media (max-width: 900px) {
    .body { grid-template-columns: 1fr; }
    .log-panel { max-height: 200px; border-left: none; border-top: 1px solid #1e3a5f44; }
    .grid2 { grid-template-columns: 1fr; }
  }
</style>

<div class="app">
  <!-- ── HEADER ── -->
  <header class="header">
    <div class="logo">SEC<span>NET</span> SIM</div>
    <div style="font-size:11px; color:#4a6a8a; font-family:'Share Tech Mono',monospace; letter-spacing:1px;">
      INTERACTIVE SECURE COMMUNICATION SIMULATOR
    </div>
    <div class="status-badges">
      <span class="badge {cryptoReady ? 'green' : 'amber'}">
        {cryptoReady ? '● CRYPTO READY' : '○ INITIALIZING…'}
      </span>
      <button class="toggle-btn mitm {mitmEnabled ? 'on' : ''}"
        on:click={() => { mitmEnabled = !mitmEnabled; log(`[MODE] MITM ${mitmEnabled ? 'ENABLED' : 'DISABLED'}`, mitmEnabled ? 'danger' : 'system'); }}>
        MITM {mitmEnabled ? 'ON' : 'OFF'}
      </button>
      <button class="toggle-btn sniffer {snifferEnabled ? 'on' : ''}"
        on:click={() => { snifferEnabled = !snifferEnabled; log(`[MODE] Packet Sniffing ${snifferEnabled ? 'ENABLED' : 'DISABLED'}`, snifferEnabled ? 'warn' : 'system'); }}>
        SNIFF {snifferEnabled ? 'ON' : 'OFF'}
      </button>
      <a class="btn btn-blue" href="/">HOME</a>
    </div>
  </header>

  <!-- ── TABS ── -->
  <nav class="tabs">
    {#each [['network','NETWORK MAP'],['chat','SECURE CHAT'],['tls','TLS HANDSHAKE'],['rsa','RSA / AES'],['firewall','FIREWALL']] as [id, label]}
      <button class="tab {activeTab === id ? 'active' : ''}" on:click={() => activeTab = id}>{label}</button>
    {/each}
  </nav>

  <!-- ── BODY ── -->
  <div class="body">
    <main class="main-panel">

      <!-- ═══════════════ NETWORK MAP ═══════════════ -->
      {#if activeTab === 'network'}
        <p class="section-title">▸ Live Network Topology</p>

        <!-- Network SVG -->
        <svg class="network-svg" viewBox="0 0 800 380">
          <defs>
            <marker id="arr" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto">
              <path d="M0,0 L0,6 L8,3 z" fill="#1e3a5f"/>
            </marker>
            <!-- Grid pattern -->
            <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#1e3a5f" stroke-width="0.3"/>
            </pattern>
          </defs>

          <!-- Background grid -->
          <rect width="800" height="380" fill="url(#grid)" opacity="0.5"/>

          <!-- Edges -->
          {#each EDGES as e}
            {@const f = NODES[e.from]}
            {@const t = NODES[e.to]}
            <line x1={f.x} y1={f.y} x2={t.x} y2={t.y}
              stroke="#1e3a5f" stroke-width="1.5"
              stroke-dasharray={mitmEnabled && (e.from === 'R1' || e.from === 'R2') ? '4 4' : 'none'}
              marker-end="url(#arr)"
            />
          {/each}

          <!-- MITM edges when active -->
          {#if mitmEnabled}
            {#each ['R1','R2'] as r}
              {@const f = NODES[r]}
              {@const m = NODES.M}
              <line x1={f.x} y1={f.y} x2={m.x} y2={m.y} stroke="#f87171" stroke-width="1.5" stroke-dasharray="5 3" opacity="0.7"/>
              <line x1={m.x} y1={m.y} x2={NODES.FW.x} y2={NODES.FW.y} stroke="#f87171" stroke-width="1.5" stroke-dasharray="5 3" opacity="0.7"/>
            {/each}
          {/if}

          <!-- Nodes -->
          {#each Object.values(NODES) as node}
            {#if node.id !== 'M' || mitmEnabled}
              {@const flash = flashNodes[node.id]}
              <g transform="translate({node.x},{node.y})">
                <!-- Glow ring -->
                <circle r="28" fill="none" stroke={flash || node.color} stroke-width="0.5" opacity={flash ? 0.8 : 0.2}/>
                <!-- Main circle -->
                <circle r="20" fill="#0c1828" stroke={flash || node.color} stroke-width={flash ? 2.5 : 1.5} class="node-circle" style="color:{flash || node.color}"/>
                <!-- Label -->
                {#if node.label.includes('\n')}
                  {@const parts = node.label.split('\n')}
                  <text text-anchor="middle" font-family="'Share Tech Mono',monospace" font-size="9" fill={node.color} y="-4">{parts[0]}</text>
                  <text text-anchor="middle" font-family="'Share Tech Mono',monospace" font-size="8" fill={node.color} y="7" opacity="0.7">{parts[1]}</text>
                {:else}
                  <text text-anchor="middle" font-family="'Share Tech Mono',monospace" font-size="9" fill={node.color} dy="3">{node.label}</text>
                {/if}
                <!-- Role label below -->
                <text text-anchor="middle" font-family="'Share Tech Mono',monospace" font-size="8" fill="#4a6a8a" y="36">{node.id}</text>
              </g>
            {/if}
          {/each}

          <!-- Animated packets -->
          {#each animating as pkt (pkt.id)}
            <circle class="packet-dot" r="7"
              cx={pkt.tx} cy={pkt.ty}
              fill={pkt.encrypted ? '#4ade80' : '#f87171'}
              stroke={pkt.encrypted ? '#4ade8066' : '#f8717166'}
              stroke-width="4"
              opacity="0.9"
            />
          {/each}

          <!-- Legend -->
          <g transform="translate(20,350)">
            {#each [['#4ade80','Encrypted PKT'],['#f87171','Plaintext / Tampered'],['#1e3a5f','Network Link']] as [c,l]}
              {@const i = [['#4ade80','Encrypted PKT'],['#f87171','Plaintext / Tampered'],['#1e3a5f','Network Link']].indexOf([c,l])}
              <circle cx={i*180} cy="0" r="5" fill={c}/>
              <text x={i*180+12} y="4" font-family="'Share Tech Mono',monospace" font-size="10" fill="#4a6a8a">{l}</text>
            {/each}
          </g>
        </svg>

        <!-- Quick actions -->
        <div class="card">
          <div class="card-title">▸ Quick Packet Tests</div>
          <div class="controls-row">
            <select class="select" bind:value={chatRoute}>
              <option value="R1">via Router 1</option>
              <option value="R2">via Router 2</option>
            </select>
            <button class="btn btn-green" disabled={!cryptoReady}
              on:click={() => sendPacket('PING test packet', 'TCP', 443, true)}>
              Send Encrypted TCP:443
            </button>
            <button class="btn btn-amber" disabled={!cryptoReady}
              on:click={() => sendPacket('plaintext-data', 'TCP', 80, false)}>
              Send Plaintext TCP:80
            </button>
            <button class="btn btn-red" disabled={!cryptoReady}
              on:click={() => sendPacket('blocked-pkt', 'TCP', 22, false)}>
              Send SSH TCP:22 (blocked)
            </button>
          </div>
          <div style="font-size:11px; color:#4a6a8a; font-family:'Share Tech Mono',monospace; line-height:1.8;">
            {mitmEnabled ? '⚠ MITM ACTIVE — Mallory sits between routers and the firewall. Packets will be intercepted and tampered.' : '✓ Network path clean — no adversary present.'}
            {snifferEnabled ? ' | 👁 SNIFFER ON — plaintext packets will be logged in cleartext.' : ''}
          </div>
        </div>

      <!-- ═══════════════ SECURE CHAT ═══════════════ -->
      {:else if activeTab === 'chat'}
        <p class="section-title">▸ Alice ↔ Bob Secure Chat</p>

        <div class="card">
          <div class="controls-row">
            <label style="display:flex;align-items:center;gap:8px;font-size:12px;font-family:'Share Tech Mono',monospace;color:#4a6a8a;cursor:pointer;">
              <input type="checkbox" bind:checked={encryptChat} style="accent-color:#4ade80"/>
              AES-256-GCM Encryption
            </label>
            <select class="select" bind:value={chatRoute}>
              <option value="R1">Route via R1</option>
              <option value="R2">Route via R2</option>
            </select>
            {#if mitmEnabled}
              <span class="badge red">⚠ MITM ACTIVE</span>
            {/if}
          </div>
        </div>

        <div class="chat-messages">
          {#if chatMessages.length === 0}
            <div style="text-align:center;margin:auto;color:#2a4a6a;font-family:'Share Tech Mono',monospace;font-size:12px;line-height:2;">
              No messages yet.<br>Type something and press Enter or Send.
            </div>
          {/if}
          {#each chatMessages as m}
            <div class="chat-msg {m.from.toLowerCase()}">
              <div class="chat-bubble">{m.text}</div>
              <div class="chat-meta">
                <span>{m.from}</span>
                <span>{m.ts}</span>
                {#if m.enc}<span class="enc-badge">🔒 AES-GCM</span>{/if}
              </div>
            </div>
          {/each}
        </div>

        <div class="input-row">
          <input class="input" placeholder="Type a message…" bind:value={chatInput} on:keydown={handleKey} disabled={!cryptoReady}/>
          <button class="btn btn-green" disabled={!cryptoReady || !chatInput.trim()} on:click={sendChat}>SEND</button>
        </div>

      <!-- ═══════════════ TLS HANDSHAKE ═══════════════ -->
      {:else if activeTab === 'tls'}
        <p class="section-title">▸ TLS 1.3 Handshake Simulation</p>

        <div class="card">
          <div class="controls-row">
            <button class="btn btn-blue" on:click={runTLS} disabled={tlsRunning}>
              {tlsRunning ? '⟳ Running…' : '▶ Run TLS 1.3 Handshake'}
            </button>
            <button class="btn btn-red btn-sm" on:click={() => { tlsSteps=[]; tlsComplete=false; tlsSession=null; }}>RESET</button>
            {#if tlsComplete}
              <span class="badge green">● SESSION ESTABLISHED</span>
            {/if}
          </div>
          {#if tlsSession}
            <div style="font-family:'Share Tech Mono',monospace;font-size:11px;color:#4a6a8a;line-height:2;">
              Cipher: <span style="color:#4ade80">{tlsSession.cipher}</span> &nbsp;|&nbsp;
              Version: <span style="color:#60a5fa">{tlsSession.version}</span>
            </div>
          {/if}
        </div>

        <!-- Column headers -->
        {#if tlsSteps.length > 0}
        <div style="display:grid;grid-template-columns:1fr 60px 1fr;gap:8px;margin-bottom:8px;">
          <div style="text-align:right;font-family:'Share Tech Mono',monospace;font-size:12px;color:#4ade80;letter-spacing:2px;">ALICE (Client)</div>
          <div></div>
          <div style="text-align:left;font-family:'Share Tech Mono',monospace;font-size:12px;color:#a78bfa;letter-spacing:2px;">BOB (Server)</div>
        </div>
        {/if}

        <div class="tls-timeline">
          {#each tlsSteps as step}
            <div class="tls-step">
              {#if step.from === 'Alice' && step.to === 'Bob'}
                <div class="tls-alice">
                  <div class="tls-label" style="color:{step.color}">{step.label}</div>
                  <div class="tls-detail">{step.detail}</div>
                </div>
                <div class="tls-arrow" style="color:{step.color}">→</div>
                <div></div>
              {:else if step.from === 'Bob' && step.to === 'Alice'}
                <div></div>
                <div class="tls-arrow" style="color:{step.color}">←</div>
                <div class="tls-bob">
                  <div class="tls-label" style="color:{step.color}">{step.label}</div>
                  <div class="tls-detail">{step.detail}</div>
                </div>
              {:else}
                <div class="tls-both">
                  <div class="tls-label" style="color:{step.color};text-align:center;">{step.label}</div>
                  <div class="tls-detail" style="text-align:center;">{step.detail}</div>
                </div>
              {/if}
            </div>
          {/each}
        </div>

      <!-- ═══════════════ RSA / AES ═══════════════ -->
      {:else if activeTab === 'rsa'}
        <p class="section-title">▸ RSA-OAEP & AES-256-GCM Crypto Demo</p>

        <div class="grid2">
          <div class="card">
            <div class="card-title">Alice's RSA Public Key</div>
            <div class="mono-box">{rsaPublicA || '…generating…'}</div>
            <div style="font-size:11px;color:#4a6a8a;font-family:'Share Tech Mono',monospace;">RSA-OAEP / 2048-bit / SHA-256</div>
          </div>
          <div class="card">
            <div class="card-title">Bob's RSA Public Key</div>
            <div class="mono-box">{rsaPublicB || '…generating…'}</div>
            <div style="font-size:11px;color:#4a6a8a;font-family:'Share Tech Mono',monospace;">RSA-OAEP / 2048-bit / SHA-256</div>
          </div>
        </div>

        <div class="card">
          <div class="card-title">RSA Encrypt → Decrypt Demo</div>
          <div class="controls-row">
            <input class="input" style="flex:1" bind:value={rsaInput} placeholder="Message to encrypt…"/>
            <button class="btn btn-purple" disabled={!rsaKeysReady} on:click={doRsaDemo}>
              Encrypt with Bob's Key
            </button>
          </div>
          {#if rsaEncrypted}
            <div style="font-family:'Share Tech Mono',monospace;font-size:11px;color:#4a6a8a;margin-bottom:6px;">Ciphertext (Bob's pub key):</div>
            <div class="mono-box amber">{rsaEncrypted.slice(0, 128)}…</div>
            <div style="font-family:'Share Tech Mono',monospace;font-size:11px;color:#4a6a8a;margin-bottom:6px;">Decrypted (Bob's priv key):</div>
            <div class="mono-box green">{rsaDecrypted}</div>
          {/if}
        </div>

        <div class="card">
          <div class="card-title">AES-256-GCM Live Demo</div>
          <div style="font-family:'Share Tech Mono',monospace;font-size:11px;color:#4a6a8a;line-height:2;margin-bottom:10px;">
            AES session key: <span style="color:#4ade80">{cryptoReady ? 'Generated (256-bit, non-extractable)' : '…'}</span><br>
            Mode: <span style="color:#60a5fa">GCM (authenticated encryption)</span><br>
            IV size: <span style="color:#a78bfa">96 bits (random per message)</span>
          </div>
          <div class="controls-row">
            <button class="btn btn-green" disabled={!cryptoReady}
              on:click={async () => {
                const plain = 'AES test message ' + Date.now();
                const enc = await aesEncrypt(plain);
                log(`[AES] Plaintext: "${plain}"`, 'crypto');
                log(`[AES] IV: ${enc.iv.slice(0,6).join(',')}… CT: ${enc.ct.length} bytes`, 'crypto');
                const dec = await aesDecrypt(enc);
                log(`[AES] Decrypted: "${dec}" ✓`, 'success');
              }}>
              Run AES Encrypt/Decrypt
            </button>
            <button class="btn btn-amber" disabled={!cryptoReady}
              on:click={async () => {
                const enc = await aesEncrypt('tampered message');
                enc.ct[0] ^= 0xff;
                try {
                  await aesDecrypt(enc);
                  log('[AES-GCM] ⚠ Tamper NOT detected (unexpected)', 'warn');
                } catch {
                  log('[AES-GCM] ✓ Tamper DETECTED — authentication tag mismatch', 'success');
                }
              }}>
              Simulate Tamper Attack
            </button>
          </div>
        </div>

      <!-- ═══════════════ FIREWALL ═══════════════ -->
      {:else if activeTab === 'firewall'}
        <p class="section-title">▸ Firewall Rule Engine</p>

        <div class="card">
          <div class="card-title">Add Rule</div>
          <div class="controls-row">
            <select class="select" bind:value={newRule.proto}>
              <option>TCP</option><option>UDP</option><option>ICMP</option>
            </select>
            <input class="input" type="number" placeholder="Port" bind:value={newRule.port} style="width:90px"/>
            <select class="select" bind:value={newRule.action}>
              <option>ALLOW</option><option>BLOCK</option>
            </select>
            <button class="btn btn-blue" on:click={addRule} disabled={!newRule.port}>+ Add Rule</button>
          </div>
        </div>

        <div class="card">
          <div class="card-title">Active Rules (evaluated top-down)</div>
          <table class="fw-table">
            <thead>
              <tr>
                <th>#</th><th>Proto</th><th>Port</th><th>Action</th><th>Status</th><th>Test</th><th></th>
              </tr>
            </thead>
            <tbody>
              {#each firewallRules as rule, i}
                <tr style="opacity:{rule.active ? 1 : 0.4}">
                  <td style="color:#4a6a8a">{i+1}</td>
                  <td style="color:#60a5fa">{rule.proto}</td>
                  <td style="color:#c8d6e5">{rule.port}</td>
                  <td><span class="rule-badge {rule.action.toLowerCase()}">{rule.action}</span></td>
                  <td style="color:{rule.active ? '#4ade80' : '#4a6a8a'}">{rule.active ? 'ON' : 'OFF'}</td>
                  <td>
                    <button class="btn btn-blue btn-sm" disabled={!cryptoReady}
                      on:click={() => sendPacket('test', rule.proto, rule.port, false)}>
                      TEST
                    </button>
                  </td>
                  <td style="display:flex;gap:6px;align-items:center;">
                    <button class="btn btn-amber btn-sm" on:click={() => toggleRule(rule.id)}>
                      {rule.active ? 'DISABLE' : 'ENABLE'}
                    </button>
                    <button class="btn btn-red btn-sm" on:click={() => deleteRule(rule.id)}>✕</button>
                  </td>
                </tr>
              {/each}
            </tbody>
          </table>
        </div>

        <div class="card">
          <div class="card-title">Defense Info</div>
          <div style="font-family:'Share Tech Mono',monospace;font-size:11px;color:#4a6a8a;line-height:2.2;">
            ● Rules evaluated <span style="color:#60a5fa">top-down</span> — first match wins<br>
            ● TCP:443 ALLOWED → encrypted HTTPS traffic<br>
            ● TCP:80 BLOCKED → no unencrypted HTTP<br>
            ● TCP:22 BLOCKED → SSH locked down<br>
            ● Default policy: <span style="color:#4ade80">ALLOW</span> (explicit-deny model)
          </div>
        </div>
      {/if}

    </main>

    <!-- ── LOG SIDEBAR ── -->
    <aside class="log-panel">
      <div class="log-header">
        <span>▸ SYSTEM LOG</span>
        <button class="log-clear" on:click={() => logs = []}>CLEAR</button>
      </div>
      <div class="log-entries">
        {#each logs as entry}
          <div class="log-entry {entry.type}">
            <span class="log-ts">{entry.ts}</span>
            <span class="log-msg">{entry.msg}</span>
          </div>
        {/each}
      </div>
    </aside>
  </div>
</div>
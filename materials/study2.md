# SecNet Sim — Presentation Guide
### Interactive Secure Communication Network Simulator

---

## What Is This Project?

SecNet Sim is a **fully browser-based** interactive platform that demonstrates how modern secure communication works — and how it can be attacked or defended. Every concept (encryption, packet routing, MITM attacks, TLS handshakes, firewall rules) is not just visualized but **actually executed** using real cryptographic APIs built into the browser (`window.crypto.subtle`).

There is **no backend server**. All cryptography runs live in the client.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | SvelteKit |
| Cryptography | Web Crypto API (`crypto.subtle`) — browser-native |
| Encryption | AES-256-GCM (symmetric), RSA-OAEP 2048-bit (asymmetric) |
| Routing | Custom in-memory packet simulation |
| UI | Svelte reactive state + SVG animations |
| Fonts | Share Tech Mono, Exo 2 (Google Fonts) |

---

## System Architecture

```
Alice (Client)
    │
    ├──→ Router 1 ──→ [Mallory if MITM ON] ──→ Firewall ──→ Bob (Server)
    │
    └──→ Router 2 ──→ [Mallory if MITM ON] ──→ Firewall ──→ Bob (Server)
```

On page load:
1. A **256-bit AES-GCM session key** is generated
2. **Two RSA-OAEP 2048-bit key pairs** are generated — one for Alice, one for Bob
3. All keys stay in browser memory (never sent anywhere)
4. The System Log panel confirms each step in real time

---

## The 5 Tabs — What Each Does

---

### Tab 1 — Network Map

**What you see:** A live SVG topology showing Alice → Router 1/2 → Firewall → Bob, with animated packet dots moving along the network path.

**What it demonstrates:**
- Packet routing: how data hops between nodes to reach a destination
- Two redundant paths (Router 1 and Router 2) — simulating real network path selection
- Visual distinction between encrypted packets (green dot) and plaintext packets (red dot)
- Node flash animations when a packet arrives or is blocked

**Key interactions:**

| Button | What happens |
|---|---|
| Send Encrypted TCP:443 | Packet is AES-encrypted, travels Alice → Router → Firewall → Bob, green dot animates |
| Send Plaintext TCP:80 | Unencrypted packet travels the same path, red dot, firewall BLOCKS it (rule: TCP:80 = BLOCK) |
| Send SSH TCP:22 | Firewall blocks it instantly — TCP:22 rule is active |
| MITM toggle (header) | Mallory node appears between routers and firewall, intercepts all traffic |
| SNIFF toggle (header) | Sniffer reads plaintext content from unencrypted packets and logs it |

**What to say:** *"This is the network layer. Every packet you send is a real JavaScript object being routed through this node graph. The path is chosen here, the firewall evaluates it, and the packet animation shows exactly where it goes and whether it's protected."*

---

### Tab 2 — Secure Chat

**What you see:** A two-person encrypted chat interface between Alice and Bob.

**What it demonstrates:**
- End-to-end encrypted messaging using AES-256-GCM
- How the same message looks completely different on the wire (ciphertext vs plaintext)
- What happens when MITM is enabled — the received message is `[TAMPERED by Mallory]`
- Packet sniffing: with sniff ON and encryption OFF, the exact message content is captured and shown in the log

**Key interactions:**

| Scenario | How to demo it |
|---|---|
| Encrypted chat | Toggle encryption ON, type a message, send — Bob receives the correct message |
| Plaintext interception | Toggle encryption OFF, enable SNIFFER — log shows the full message text captured mid-route |
| MITM attack | Enable MITM, send any message — Bob receives `[TAMPERED by Mallory]` instead |
| Route selection | Switch between Router 1 and Router 2 — changes the path shown in the animation |

**What to say:** *"This is the application layer. The chat uses real AES-256-GCM encryption — the same standard used by WhatsApp and Signal. Notice that when MITM is enabled, Bob never receives the original message. And when the sniffer is on without encryption, the attacker reads everything in the log."*

---

### Tab 3 — TLS Handshake

**What you see:** An animated step-by-step timeline of a TLS 1.3 handshake between Alice (client) and Bob (server).

**What it demonstrates:**
- The full handshake sequence that happens before any HTTPS data is exchanged
- The role of certificates, cipher negotiation, key derivation, and mutual authentication
- Why TLS is considered the foundation of secure web communication

**The 10 steps shown:**

| Step | Direction | What it means |
|---|---|---|
| Client Hello | Alice → Bob | Alice proposes TLS 1.3 + supported cipher suites + a random nonce |
| Server Hello | Bob → Alice | Bob selects a cipher suite and sends its own random value |
| Certificate | Bob → Alice | Bob proves its identity with an X.509 certificate (RSA-2048 public key) |
| Certificate Verify | Bob → Alice | Digital signature over the entire handshake so far — proves Bob holds the private key |
| Finished (Server) | Bob → Alice | HMAC over all messages — integrity proof |
| Pre-Master Secret | Alice → Bob | Alice encrypts a random value with Bob's public key — only Bob can decrypt it |
| Key Derivation | Both | Both sides independently compute the same session keys (write_key + write_IV) from the pre-master secret |
| Change Cipher Spec | Alice → Bob | Signal to switch to encrypted mode |
| Finished (Client) | Alice → Bob | Client-side HMAC to confirm mutual authentication |
| Secure Channel | Both | Application data now flows encrypted with AES-256-GCM |

**What to say:** *"This simulates what happens every time your browser connects to an HTTPS site. Before a single byte of data is exchanged, 9 messages are sent back and forth to agree on keys, verify identities, and confirm integrity. The session key is never transmitted — both sides derive it independently from the pre-master secret."*

---

### Tab 4 — RSA / AES

**What you see:** A live cryptography laboratory with two sections — RSA asymmetric encryption and AES symmetric encryption.

**What it demonstrates:**

#### RSA-OAEP (Asymmetric)
- Alice and Bob each have a **real 2048-bit RSA key pair** generated on page load
- The public key (used to encrypt) is displayed — anyone can see it
- Only the holder of the private key can decrypt — Bob's private key never leaves browser memory
- You can type any message, encrypt it with Bob's public key, and watch the ciphertext appear
- Clicking decrypt shows the original message recovered using Bob's private key

**Why it matters:** RSA is used in the key exchange phase of TLS — it solves the problem of securely sharing a secret over an untrusted network.

#### AES-256-GCM (Symmetric)
- A single 256-bit key is shared between Alice and Bob (established via the RSA exchange in TLS)
- Every message gets a fresh random **96-bit IV (Initialization Vector)** — so the same plaintext never produces the same ciphertext twice
- **GCM mode** = authenticated encryption — it detects tampering

The **Simulate Tamper Attack** button:
- Encrypts a message with AES-GCM
- Flips one bit in the ciphertext (`ct[0] ^= 0xFF`)
- Attempts to decrypt — the GCM authentication tag fails
- Log shows: `✓ Tamper DETECTED — authentication tag mismatch`

**What to say:** *"RSA solves the key distribution problem — you can publish your public key to the world and only you can decrypt what's sent to you. But RSA is slow, so in practice it's only used to exchange a symmetric AES key. AES is fast and secure for bulk data. GCM mode adds authentication — if anyone tampers with even one bit of the ciphertext, decryption fails completely. That's exactly what the tamper button proves."*

---

### Tab 5 — Firewall

**What you see:** A live firewall rule engine with a table of rules, add/remove/enable/disable controls, and a test button per rule.

**What it demonstrates:**
- How stateless packet filtering firewalls work
- Rules are evaluated **top-down** — the first matching rule wins (just like iptables or AWS Security Groups)
- The difference between ALLOW and BLOCK decisions
- How network defense policy is expressed as rules

**Default rules preloaded:**

| # | Protocol | Port | Action | Why |
|---|---|---|---|---|
| 1 | TCP | 443 | ALLOW | HTTPS — encrypted web traffic |
| 2 | TCP | 80 | BLOCK | HTTP — unencrypted, should not pass |
| 3 | UDP | 53 | ALLOW | DNS — needed for name resolution |
| 4 | TCP | 22 | BLOCK | SSH — locked down by policy |

**Key interactions:**

| Action | Effect |
|---|---|
| Click TEST on any rule | Fires a real packet through the network, firewall evaluates the rule, result logged |
| Add a new rule | Enter proto + port + action, click Add — rule appears immediately in the table |
| DISABLE a rule | Rule greys out and is skipped during evaluation |
| Delete a rule | Rule removed, default ALLOW policy applies |

**What to say:** *"This is a simplified version of what a real firewall does. Every packet that enters the network is checked against this rule list from top to bottom. The first match determines the outcome — allow or drop. If nothing matches, the default policy applies. This is exactly how AWS Security Groups, iptables, and Windows Firewall work."*

---

## The System Log (Right Sidebar)

The log panel is always visible on the right side. Every action across all tabs produces a timestamped, color-coded log entry:

| Color | Meaning |
|---|---|
| Blue | System events (key generation, mode changes) |
| Green | Success (decryption OK, rule ALLOW, crypto ready) |
| Purple | Cryptographic operations (encrypt, decrypt, IV, ciphertext) |
| Yellow | Warnings (sniffer captures, unexpected behavior) |
| Red | Attacks and blocks (MITM intercept, FIREWALL BLOCK) |
| Grey | General packet routing info |

This log is the **audit trail** of the entire simulation. It proves what's happening under the hood.

---

## The Two Global Attack Modes

These toggles are in the top-right header and affect the entire simulation across all tabs.

### MITM (Man-in-the-Middle)

When ON:
- Mallory's node appears on the network map between the routers and the firewall
- All packets are routed through Mallory before reaching Bob
- Mallory intercepts the packet and replaces the payload with `[TAMPERED by Mallory]`
- Bob receives the tampered message — Alice is unaware
- The log records: `[MITM] Mallory intercepted packet #N! Payload tampered.`

**Real-world parallel:** Public WiFi attacks, ARP spoofing, DNS poisoning — any scenario where the attacker sits between two communicating parties.

**Defense:** End-to-end encryption + certificate pinning (TLS). When the chat is encrypted with AES-GCM and MITM is ON, Mallory intercepts the ciphertext but cannot read or validly modify it — because she doesn't have the AES key.

### Packet Sniffer

When ON:
- Every packet passing through the network is inspected
- If the packet is **plaintext**: the full message content is logged in red (`[SNIFFER] Plaintext captured: "..."`)
- If the packet is **encrypted**: the sniffer logs only the raw ciphertext bytes — unreadable (`captured ciphertext (unreadable)`)

**Real-world parallel:** Wireshark, tcpdump, network tap — any passive eavesdropping tool on an unencrypted network.

**Defense:** Encryption. This is the clearest demo of why HTTPS matters over HTTP.

---

## Suggested Demo Flow for the Presentation

### Step 1 — Open the page, show the log
Point to the right sidebar. Show AES key generation and RSA key pair generation happening automatically. Say: *"Real cryptographic keys are being generated in the browser right now using the Web Crypto API."*

### Step 2 — Network Map: send an encrypted packet
Click **Send Encrypted TCP:443**. Watch the green dot travel Alice → Router 1 → Firewall → Bob. Point to the log: encrypted, 443, allowed. Say: *"This is a normal HTTPS packet. Encrypted, routed, firewall approves it."*

### Step 3 — Network Map: send a plaintext packet
Click **Send Plaintext TCP:80**. Red dot, firewall flashes red, log says BLOCKED. Say: *"Unencrypted HTTP — the firewall drops it. Same packet structure, different port, different policy."*

### Step 4 — Enable Sniffer + send plaintext chat
Go to Secure Chat. Turn off encryption. Enable SNIFFER. Send a message. Show the log capturing the exact text. Say: *"This is what Wireshark sees on an unencrypted network. The attacker reads everything."*

### Step 5 — Enable encryption, send again
Toggle encryption back ON. Send another message. Show the log — sniffer captures only unreadable ciphertext. Say: *"With AES-256-GCM, the sniffer gets bytes it can't use. This is why HTTPS exists."*

### Step 6 — Enable MITM, send a message
Enable MITM toggle. Send a chat message. Bob receives `[TAMPERED by Mallory]`. Point to the network map — Mallory's node is now in the path. Say: *"Man-in-the-middle. The attacker is physically between the two endpoints. Without end-to-end encryption, they can modify anything."*

### Step 7 — TLS Handshake
Go to TLS tab. Click Run. Walk through each step as it animates. Pause at Key Derivation — say: *"The session key is never sent. Both sides derive it independently. That's the magic of key exchange."*

### Step 8 — RSA / AES tab
Type something in the RSA input. Click Encrypt. Show the 256-byte ciphertext blob. Click Decrypt — original message. Then click Simulate Tamper Attack — log says tamper detected. Say: *"GCM is authenticated encryption. You can't silently modify the data. The receiver knows."*

### Step 9 — Firewall
Go to Firewall tab. Add a rule: TCP port 8080 BLOCK. Click TEST on it. Show the block in the log. Disable the rule, test again — now it passes. Say: *"This is a live policy engine. Same principle as AWS Security Groups or iptables."*

---

## Key Concepts to Know for Q&A

**Why AES and RSA together?**
RSA is asymmetric — mathematically slow, max ~256 bytes of data per operation. AES is symmetric — fast, can encrypt gigabytes per second. In TLS, RSA is used once to securely exchange an AES key, then AES handles all subsequent data. This is called a hybrid cryptosystem.

**What is GCM mode?**
Galois/Counter Mode. It combines AES encryption with a polynomial MAC (message authentication code). Every ciphertext includes an authentication tag. If even one bit changes, the tag verification fails and decryption is rejected. This catches both accidental corruption and deliberate tampering.

**What is OAEP?**
Optimal Asymmetric Encryption Padding. RSA alone is deterministic — same plaintext always produces the same ciphertext, which leaks information. OAEP adds randomness to the padding before encryption, making each encryption unique even for identical messages.

**Why is the IV (Initialization Vector) important in AES?**
AES-GCM requires a unique IV for every encryption with the same key. Reusing an IV with the same key completely breaks GCM's security — an attacker can recover the keystream. This simulator generates a fresh cryptographically random 96-bit IV for every message.

**What does the firewall actually check?**
Protocol (TCP/UDP/ICMP) and destination port. It's a stateless filter — it does not inspect packet contents, track connection state, or do deep packet inspection. It's the first line of defense, not the last.

**Why does MITM succeed on plaintext but fail on encrypted traffic?**
MITM can intercept and modify raw bytes. But if those bytes are AES-GCM ciphertext, any modification will cause the authentication tag to fail at the receiver's end — the tampered packet is rejected. Without the AES key, Mallory cannot produce a validly authenticated modified message.

---

## Summary — What Each Concept Proves

| Concept | What the simulator proves |
|---|---|
| AES-256-GCM | Real-time symmetric encryption with tamper detection |
| RSA-OAEP | Public-key encryption: anyone encrypts, only the key owner decrypts |
| Packet Routing | Data hops through nodes; path selection affects latency and exposure |
| MITM Attack | Without E2E encryption, a network-layer attacker controls the conversation |
| Packet Sniffing | Unencrypted traffic is fully readable by any observer on the network |
| TLS Handshake | How two strangers agree on a shared secret without ever transmitting it |
| Firewall Defense | Policy-based access control at the network perimeter |
| Secure Chat | All concepts combined into a real application layer scenario |

---

*Built with SvelteKit + Web Crypto API. No backend. No libraries. All cryptography is native browser.*
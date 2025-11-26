# 🧩 n8n-nodes-iotivp-verify  
### IoTIVP Verify (Gateway) – n8n Community Node

This repository will host the **n8n node** for the IoTIVP protocol suite.

The node will:

- Accept **IoTIVP-Binary** packets as hex or base64
- Decode them using the **IoTIVP-Gateway** pipeline
- Convert to **IoTIVP-Core** JSON
- Run the **IoTIVP-Verify** engine
- Output a trusted packet with:
  - `core_packet` (JSON)
  - `verify_result` (integrity score 0–100 + flags)

This makes IoTIVP usable directly inside **n8n workflows** for:

- IoT telemetry pipelines  
- Robotics + automation  
- Cloud integrity checks  
- Alerting and incident response  
- GovTech / Digital Consulate flows  
- Any system that needs to **trust** IoT data before acting on it.

---

## Status

- ✅ Protocol designed (IoTIVP-Binary, IoTIVP-Core, IoTIVP-Verify, IoTIVP-Gateway)
- ✅ Node behavior specified (inputs, outputs, parameters)
- ⏳ Implementation: coming next (TypeScript-based n8n node)
- ⏳ Packaging as a community node

---

## Planned Node Name

**Display name in n8n:**  
`IoTIVP Verify (Gateway)`

**Internal name:**  
`iotivpVerify`

---

## Planned Usage (High-Level)

1. Add node **“IoTIVP Verify (Gateway)”** to your workflow.
2. Feed it a `packet_hex` field from:
   - Webhook
   - MQTT
   - HTTP Request
   - File
   - Custom trigger
3. Configure:
   - Shared secret
   - Hash algorithm and length
   - Binary layout (timestamp, device ID, nonce lengths)
   - Field ranges (temperature, humidity, battery, etc.)
4. Node outputs:
   - `core_packet` (decoded structured JSON)
   - `verify_result` (valid + integrity_score + flags)

You can then route based on integrity_score (e.g. block < 70, alert < 50, fully trust > 90).

---

## Relationship to IoTIVP Repos

This node depends on:

- [`IoTIVP-Binary`](https://github.com/IoTIVP/IoTIVP-Binary)
- [`IoTIVP-Core`](https://github.com/IoTIVP/IoTIVP-Core)
- [`IoTIVP-Verify`](https://github.com/IoTIVP/IoTIVP-Verify)
- [`IoTIVP-Gateway`](https://github.com/IoTIVP/IoTIVP-Gateway)

The node will internally use the same logic as `process_binary_packet(...)` from the Gateway layer.

---

## Roadmap for This Repo

- [ ] Add technical spec (`SPEC.md`) describing node parameters and I/O
- [ ] Scaffold n8n custom node structure (TypeScript)
- [ ] Implement Binary → Core → Verify pipeline inside node
- [ ] Add example workflows (JSON exports)
- [ ] Publish as a public n8n community node

---

IoTIVP turns IoT data into **trusted data**.  
This repo makes that power available inside **n8n workflows.**

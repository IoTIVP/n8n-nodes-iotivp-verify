# n8n Node Specification — IoTIVP Verify (Gateway)

## 1. Node Name and Purpose

**Node Name (display):** `IoTIVP Verify (Gateway)`  
**Internal Name:** `iotivpVerify`  
**Category:** IoT / Security / Data Integrity  

This node takes a raw **IoTIVP-Binary** packet (hex string), runs it through the **IoTIVP-Gateway pipeline**, and returns:

- Decoded **IoTIVP-Core** JSON
- **IoTIVP-Verify** result (integrity score + flags)
- A unified output for downstream nodes (logging, alerts, robotics, dashboards)

---

## 2. Inputs and Outputs

### 2.1 Inputs (Item JSON)

Each inbound n8n item is expected to have:

```json
{
  "packet_hex": "01020304abcd..."
}


## Example Workflows

# Example Workflow 1 — IoT Sensor Integrity Gate (Fake-Verifier Mode)

This workflow demonstrates how the IoTIVP Verify (Gateway) node acts as a trust enforcement layer inside an n8n automation pipeline. Incoming IoT packets must pass integrity verification before triggering downstream automation, alerts, or database storage.

This example uses Fake-Verifier Mode (simulation), which outputs realistic IoTIVP-Core and IoTIVP-Verify structures, even though the node has not yet implemented real binary decoding or cryptographic hash checks.

---

## 🛰 Workflow Overview

    [Webhook: IoT Sensor Ingest]
                ↓
    [IoTIVP Verify (Gateway)]
                ↓
      [IF: Integrity ≥ 80?]
           ↙               ↘
    [Trusted Branch]   [Untrusted Branch]

---

## 1. Webhook — “IoT Sensor Ingest”

The workflow begins with an HTTP Webhook receiving packets from IoT devices.

Example Input:

    {
      "device_id": 42,
      "packet_hex": "0102a10f7fff93b2"
    }

The content of packet_hex does not matter in Fake-Verifier mode, but it mimics real binary transmission.

---

## 2. IoTIVP Verify (Gateway) — Fake-Verifier Mode

The node receives the incoming item and attaches two simulated objects:

- core_packet (IoTIVP-Core format)
- verify_result (IoTIVP-Verify validation output)

Example Output Structure:

    {
      "device_id": 42,
      "packet_hex": "0102a10f7fff93b2",

      "core_packet": {
        "header": 1,
        "timestamp": 1732212000,
        "device_id": 42,
        "nonce": 7,
        "fields": {
          "temperature": 25.4,
          "humidity": 52,
          "battery": 91
        },
        "hash": "f4a291bc",
        "_meta": {
          "mode": "fake-verifier",
          "packet_hex_seen": true
        }
      },

      "verify_result": {
        "valid": true,
        "integrity_score": 92,
        "flags": {
          "hash_mismatch": false,
          "timestamp_expired": false,
          "nonce_reuse": false,
          "value_out_of_range": []
        },
        "_meta": {
          "mode": "fake-verifier"
        }
      }
    }

This establishes the expected format long before real decoding is implemented, ensuring the API shape remains stable.

---

## 3. IF Node — “Integrity OK?”

The workflow enforces trust by evaluating:

    verify_result.integrity_score >= 80

- TRUE branch (trusted): Score ≥ 80  
- FALSE branch (untrusted): Score < 80  

In Fake-Verifier mode, the score is always 92.

---

## 4. Trusted Branch — Save or Use Sensor Data

High-integrity packets flow into the trusted pipeline.

Possible downstream actions:

- Append to Google Sheets  
- Insert into PostgreSQL / MySQL  
- Send to robotics controller (MQTT)  
- Forward to dashboard or digital twin  
- Trigger automation based on clean telemetry  

Sample trusted row (Google Sheets):

| timestamp   | device_id | temperature | humidity | battery | integrity_score |
|-------------|-----------|-------------|----------|---------|-----------------|
| 1732212000  | 42        | 25.4        | 52       | 91      | 92              |

---

## 5. Untrusted Branch — Quarantine or Alert

Low-integrity or tampered packets (in the future when real verification runs) are routed here.

Possible actions:

- Send alert (Telegram / Slack / Email)
- Log to “Quarantine” database
- Trigger forensic workflow
- Store raw packet for analysis

This establishes a clear separation between trusted and untrusted IoT data.

---

## Purpose of This Example

- Demonstrates how IoTIVP fits into real automation workflows
- Establishes a stable structure for upcoming real verification logic
- Enables testing using simulated outputs
- Provides a portfolio-ready demonstration pattern
- Shows IoTIVP as a Trust Gateway for IoT ecosystems

This is the first canonical integration pattern for IoTIVP inside n8n.

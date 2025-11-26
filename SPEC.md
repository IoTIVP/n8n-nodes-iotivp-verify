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

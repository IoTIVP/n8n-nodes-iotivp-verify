import {
  IExecuteFunctions,
} from 'n8n-core';

import {
  INodeType,
  INodeTypeDescription,
  INodeExecutionData,
} from 'n8n-workflow';

export class IotivpVerify implements INodeType {
  description: INodeTypeDescription = {
    displayName: 'IoTIVP Verify (Gateway)',
    name: 'iotivpVerify',
    group: ['transform'],
    version: 1,
    description: 'Decode IoTIVP-Binary, convert to IoTIVP-Core, and run the IoTIVP-Verify integrity engine.',
    defaults: {
      name: 'IoTIVP Verify (Gateway)',
    },
    inputs: ['main'],
    outputs: ['main'],
    properties: [
      {
        displayName: 'Shared Secret',
        name: 'sharedSecret',
        type: 'string',
        typeOptions: {
          password: true,
        },
        default: '',
        required: true,
        description: 'Shared secret used for computing and verifying the IoTIVP hash.',
      },
      {
        displayName: 'Max Age (seconds)',
        name: 'maxAgeSeconds',
        type: 'number',
        default: 60,
        description: 'Maximum allowed age for packets based on timestamp.',
      },
      {
        displayName: 'Hash Algorithm',
        name: 'hashAlg',
        type: 'options',
        options: [
          {
            name: 'BLAKE2s',
            value: 'blake2s',
          },
          {
            name: 'SHA-256',
            value: 'sha256',
          },
        ],
        default: 'blake2s',
      },
      {
        displayName: 'Hash Length (bytes)',
        name: 'hashLen',
        type: 'number',
        default: 4,
        description: 'Number of bytes of the hash to use (typically 4–8).',
      },
      {
        displayName: 'Timestamp Length (bytes)',
        name: 'timestampLen',
        type: 'number',
        default: 2,
        description: 'Number of bytes used for the timestamp field in the binary packet.',
      },
      {
        displayName: 'Device ID Length (bytes)',
        name: 'deviceIdLen',
        type: 'number',
        default: 2,
        description: 'Number of bytes used for the device ID field in the binary packet.',
      },
      {
        displayName: 'Nonce Length (bytes)',
        name: 'nonceLen',
        type: 'number',
        default: 1,
        description: 'Number of bytes used for the nonce field in the binary packet.',
      },
      {
        displayName: 'Drop Low-Integrity Packets',
        name: 'dropLowIntegrity',
        type: 'boolean',
        default: false,
        description: 'If enabled, packets with integrity score below the threshold will be dropped.',
      },
      {
        displayName: 'Integrity Threshold',
        name: 'integrityThreshold',
        type: 'number',
        default: 70,
        displayOptions: {
          show: {
            dropLowIntegrity: [true],
          },
        },
        description: 'Minimum integrity score required for a packet to be forwarded.',
      },
    ],
  };

  async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
    const items = this.getInputData();

    // ⚠️ STUB IMPLEMENTATION
    // Right now, this node does NOT decode or verify anything.
    // It simply passes items through, and adds a placeholder field.

    const returnItems: INodeExecutionData[] = [];

    for (let i = 0; i < items.length; i++) {
      const newItem = { ...items[i] };

      // Add a placeholder output to show the node is wired correctly
      newItem.json = {
        ...newItem.json,
        iotivp: {
          note: 'IoTIVP Verify node scaffold – logic not implemented yet.',
          integrity_score: null,
          valid: null,
        },
      };

      returnItems.push(newItem);
    }

    return [returnItems];
  }
}

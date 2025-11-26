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
		description:
			'Decode IoTIVP-Binary, convert to IoTIVP-Core, and run the IoTIVP-Verify integrity engine.',
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
				description:
					'Shared secret used for computing and verifying the IoTIVP hash (not yet used in Fake-Verifier Mode).',
			},
			{
				displayName: 'Max Age (seconds)',
				name: 'maxAgeSeconds',
				type: 'number',
				default: 60,
				description:
					'Maximum allowed age for packets based on timestamp (not yet enforced in Fake-Verifier Mode).',
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
				description:
					'Number of bytes used for the timestamp field in the binary packet (for future real parsing).',
			},
			{
				displayName: 'Device ID Length (bytes)',
				name: 'deviceIdLen',
				type: 'number',
				default: 2,
				description:
					'Number of bytes used for the device ID field in the binary packet (for future real parsing).',
			},
			{
				displayName: 'Nonce Length (bytes)',
				name: 'nonceLen',
				type: 'number',
				default: 1,
				description:
					'Number of bytes used for the nonce field in the binary packet (for future real parsing).',
			},
			{
				displayName: 'Drop Low-Integrity Packets',
				name: 'dropLowIntegrity',
				type: 'boolean',
				default: false,
				description:
					'If enabled, packets with integrity score below the threshold will be dropped (ignored).',
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
				description:
					'Minimum integrity score required for a packet to be forwarded.',
			},
		],
	};

	async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
		const items = this.getInputData();

		// Node parameters (not really used yet, but wired for the future)
		const dropLowIntegrity = this.getNodeParameter('dropLowIntegrity', 0) as boolean;
		const integrityThreshold = this.getNodeParameter('integrityThreshold', 0) as number;

		const returnItems: INodeExecutionData[] = [];

		for (let i = 0; i < items.length; i++) {
			const item = items[i];

			// Read packet_hex if present (but we won't actually parse it yet)
			const packetHex =
				(item.json as { packet_hex?: string }).packet_hex ?? null;

			// --- Fake-Verifier Mode ---
			// This is a SIMULATED output to show how IoTIVP data will look
			// once real decoding + verification is implemented.

			// Static but realistic-looking values
			const fakeScore = 92;

			// If dropLowIntegrity is enabled AND fakeScore < threshold, drop the item
			if (dropLowIntegrity && fakeScore < integrityThreshold) {
				// Skip pushing this item, effectively dropping it
				continue;
			}

			const fakeCorePacket = {
				header: 1,
				timestamp: 1732212000,
				device_id: 42,
				nonce: 7,
				fields: {
					temperature: 25.4,
					humidity: 52,
					battery: 91,
				},
				hash: 'f4a291bc',
				_meta: {
					mode: 'fake-verifier',
					packet_hex_seen: packetHex !== null,
				},
			};

			const fakeVerifyResult = {
				valid: true,
				integrity_score: fakeScore,
				flags: {
					hash_mismatch: false,
					timestamp_expired: false,
					nonce_reuse: false,
					value_out_of_range: [] as string[],
				},
				_meta: {
					mode: 'fake-verifier',
				},
			};

			const newItem: INodeExecutionData = {
				...item,
				json: {
					...item.json,
					core_packet: fakeCorePacket,
					verify_result: fakeVerifyResult,
				},
			};

			returnItems.push(newItem);
		}

		return [returnItems];
	}
}

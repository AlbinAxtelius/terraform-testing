import '../../polyfill/crypto'
import { DynamoDBClient, ScanCommand } from '@aws-sdk/client-dynamodb'

global

const { TABLE_NAME } = process.env

const client = new DynamoDBClient({
	region: 'eu-central-1',
})

export const handler = async () => {
	const command = new ScanCommand({ TableName: TABLE_NAME })
	const result = await client.send(command)
	return result.Count
}

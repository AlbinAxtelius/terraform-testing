import { Update } from '@aws-sdk/client-dynamodb'
import {
	BatchWriteCommand,
	UpdateCommand,
	TransactWriteCommand,
	UpdateCommandInput,
	ExecuteTransactionCommand,
} from '@aws-sdk/lib-dynamodb'

const updateTimeCommand = (
	key: Record<string, any>,
	tableName: string,
	date: string
): Update => ({
	Key: key,
	TableName: tableName,
	UpdateExpression: 'set last_updated = :date',
	ExpressionAttributeValues: {
		':date': { S: date },
	},
})

const updateNameCommand = (
	key: Record<string, any>,
	tableName: string,
	name: string
) =>
	new UpdateCommand({
		Key: key,
		TableName: tableName,
		UpdateExpression: 'set name = :date',
		ExpressionAttributeValues: {
			':name': name,
		},
	})

const compositeCommand = new ExecuteTransactionCommand({
	TransactStatements: [],
})

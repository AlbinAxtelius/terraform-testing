import { DynamoDB } from '@aws-sdk/client-dynamodb'
import { DynamoDBDocument } from '@aws-sdk/lib-dynamodb'
import { fromEnv } from '@aws-sdk/credential-providers'

const client = new DynamoDB({ region: 'eu-central-1', credentials: fromEnv() })
export const dynamo = DynamoDBDocument.from(client)


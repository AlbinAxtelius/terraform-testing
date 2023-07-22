import { DynamoDB } from '@aws-sdk/client-dynamodb'
import { DynamoDBDocument } from '@aws-sdk/lib-dynamodb'
import { fromEnv } from '@aws-sdk/credential-providers'

import * as O from 'fp-ts/lib/Option'
import { pipe } from 'fp-ts/lib/function'

export const getDatabase = (): O.Option<DynamoDBDocument> =>
	pipe(
		O.tryCatch(
			() => new DynamoDB({ region: 'eu-central-1', credentials: fromEnv() })
		),
		O.map(DynamoDBDocument.from)
	)

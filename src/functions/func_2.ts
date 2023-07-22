import type { DynamoDBDocument } from '@aws-sdk/lib-dynamodb'

import { getDatabase } from '../database/getDBClient'

import * as O from 'fp-ts/lib/Option'
import * as T from 'fp-ts/lib/Task'
import * as TO from 'fp-ts/lib/TaskOption'
import { flow, pipe } from 'fp-ts/lib/function'

const scan = (tableName: string) => (db: DynamoDBDocument) =>
	TO.tryCatch(() => db.scan({ TableName: tableName }))

const getAllItems = flow(
	TO.of<DynamoDBDocument>,
	TO.flatMap(scan('env-items')),
	TO.map((s) => s.Items || [])
)

const extractAllIds = (xs: { id?: string }[]) =>
	xs.map(
		flow(
			({ id }) => id,
			O.fromNullable,
			O.getOrElse(() => 'no id')
		)
	)

export const handler: T.Task<string[]> = pipe(
	TO.fromOption(getDatabase()),
	TO.flatMap(getAllItems),
	TO.map(extractAllIds),
	TO.getOrElse(() => T.of<string[]>([]))
)

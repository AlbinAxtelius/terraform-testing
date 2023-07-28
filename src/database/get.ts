import {
	DynamoDBDocument,
	GetCommand,
	GetCommandOutput,
} from '@aws-sdk/lib-dynamodb'
import * as TE from 'fp-ts/TaskEither'
import { pipe } from 'fp-ts/lib/function'
import z from 'zod'
import { parseValues } from './utils/parseValues'
import { GET_ERROR, GetError, NOT_FOUND_ERROR } from '../errors'

export const safeGet =
	<S extends z.ZodType>(tableName: string, schema?: S) =>
	(db: DynamoDBDocument) =>
	(id: string) => {
		const command = new GetCommand({
			Key: {
				id,
			},
			TableName: tableName,
		})

		return pipe(
			TE.tryCatch<GetError, GetCommandOutput>(
				() => db.send(command),
				(_error) => GET_ERROR
			),
			TE.map((x) => x.Item),
			TE.flatMap(TE.fromNullable(NOT_FOUND_ERROR)),
			TE.map(parseValues(schema)),
			TE.flatMap(TE.fromEither)
		)
	}

import {
	BatchWriteCommand,
	DynamoDBDocument,
	PutCommand,
	UpdateCommand,
} from '@aws-sdk/lib-dynamodb'
import * as E from 'fp-ts/Either'
import * as TE from 'fp-ts/TaskEither'
import { pipe } from 'fp-ts/lib/function'
import z from 'zod'
import { parseValues } from './utils/parseValues'
import { log } from './utils/log'
import { CREATE_ERROR } from '../errors'

export const safeCreate =
	<S extends z.ZodType>(
		tableName: string,
		schema?: S,
		defaultValue?: Partial<z.infer<S>>
	) =>
	(db: DynamoDBDocument) =>
	<T extends Record<string, any> = z.infer<S>>(id: string, data: T) => {
		const updateCommand = (x: T) =>
			new UpdateCommand({
				TableName: tableName,
				Key: { item_id: id },
				UpdateExpression: 'set #last_updated = :date',
				ExpressionAttributeValues: {
					':date': { S: '' },
				},
				ExpressionAttributeNames: {
					'#last_updated': 'last_updated',
				},
			})

		const combinedValue = { ...defaultValue, ...data }

		return pipe(
			combinedValue,
			parseValues(schema),
			E.map(updateCommand),
			E.map(log),
			TE.fromEither,
			TE.flatMap((command) =>
				TE.tryCatch(
					() => db.send(command),
					(e) => {
						console.log(e)
						return CREATE_ERROR
					}
				)
			),
			TE.map(() => combinedValue)
		)
	}

import { DynamoDBDocument, PutCommand } from '@aws-sdk/lib-dynamodb'
import * as E from 'fp-ts/Either'
import * as TE from 'fp-ts/TaskEither'
import { pipe } from 'fp-ts/lib/function'
import z from 'zod'
import { parseValues } from './utils/parseValues'
import { log } from './utils/log'

type CreateError = { type: 'CREATE_ERROR' }
const CREATE_ERROR: CreateError = { type: 'CREATE_ERROR' }

export const safeCreate =
	<S extends z.ZodType>(
		tableName: string,
		schema?: S,
		defaultValue?: Partial<z.infer<S>>
	) =>
	(db: DynamoDBDocument) =>
	<T extends Record<string, any> = z.infer<S>>(data: T) => {
		const createCommand = (x: T) =>
			new PutCommand({
				TableName: tableName,
				Item: x,
			})

		const combinedValue = { ...defaultValue, ...data }

		return pipe(
			combinedValue,
			parseValues(schema),
			E.map(createCommand),
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

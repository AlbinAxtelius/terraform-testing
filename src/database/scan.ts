import {
	DynamoDBDocument,
	ScanCommand,
	ScanCommandOutput,
} from '@aws-sdk/lib-dynamodb'
import * as TE from 'fp-ts/TaskEither'
import { pipe } from 'fp-ts/lib/function'
import z from 'zod'
import { parseValues } from './utils/parseValues'
import { ScanError, SCAN_ERROR, NOT_FOUND_ERROR } from '../errors'

export const safeScan =
	<S extends z.ZodType>(tableName: string, schema?: S) =>
	(db: DynamoDBDocument) =>
	() => {
		const command = new ScanCommand({
			TableName: tableName,
		})

		return pipe(
			TE.tryCatch<ScanError, ScanCommandOutput>(
				() => db.send(command),
				(_error) => SCAN_ERROR
			),
			TE.map((x) => x.Items),
			TE.flatMap(TE.fromNullable(NOT_FOUND_ERROR)),
			TE.map(parseValues(schema)),
			TE.flatMap(TE.fromEither)
		)
	}

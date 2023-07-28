import {
	DynamoDBDocument,
	ScanCommand,
	ScanCommandOutput,
} from '@aws-sdk/lib-dynamodb'
import * as TE from 'fp-ts/TaskEither'
import { flow, pipe } from 'fp-ts/lib/function'
import z from 'zod'
import { parseValues } from './utils/parseValues'

type NotFoundError = { type: 'NOT_FOUND_ERROR' }
const NOT_FOUND_ERROR: NotFoundError = { type: 'NOT_FOUND_ERROR' }

type ScanError = { type: 'SCAN_ERROR' }
const SCAN_ERROR: ScanError = { type: 'SCAN_ERROR' }

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

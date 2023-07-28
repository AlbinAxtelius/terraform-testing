import type { DynamoDBDocument } from '@aws-sdk/lib-dynamodb'

import { dynamo } from '../database/getDBClient'

import * as TE from 'fp-ts/lib/TaskEither'
import { pipe } from 'fp-ts/lib/function'
import { z } from 'zod'
import { safeGet } from '../database/get'

const ItemSchema = z.object({
	id: z.string(),
})

const configuredSafeGet = safeGet('env-items', ItemSchema)

const getAllItems = (db: DynamoDBDocument) => () => {
	const getItemById = configuredSafeGet(db)

	return pipe(
		TE.of('cool'),
		TE.flatMap(getItemById),
		TE.map((s) => s)
	)
}

export const handler = pipe(getAllItems(dynamo))

import * as T from 'fp-ts/lib/Task'
import * as TE from 'fp-ts/lib/TaskEither'
import { flow, pipe } from 'fp-ts/lib/function'
import { dynamo } from '../database/getDBClient'
import { CreateItem, Item, setupItemOperations } from '../entities/item'

const OkResult = (data: Item) => ({
	statusCode: 200,
	data,
})

const BadResult = (error: string) => ({
	statusCode: 400,
	error,
})

export const handler = (item: CreateItem) => {
	const { create } = setupItemOperations(dynamo)

	return pipe(
		TE.of(item),
		TE.flatMap(create),
		TE.map(OkResult),
		TE.getOrElseW(flow((x) => x.type, BadResult, T.of))
	)()
}

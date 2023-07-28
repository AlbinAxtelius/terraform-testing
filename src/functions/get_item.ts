import * as TE from 'fp-ts/lib/TaskEither'
import * as T from 'fp-ts/lib/Task'
import { flow, pipe } from 'fp-ts/lib/function'
import { Item, setupItemOperations } from '../entities/item'
import { dynamo } from '../database/getDBClient'
import { log } from '../database/utils/log'

const OkResult = (data: Item) => ({
	statusCode: 200,
	data,
})

const BadResult = (error: string) => ({
	statusCode: 400,
	error,
})

type GetItemParams = { id: string }

export const handler = ({ id }: GetItemParams) => {
	const { getById } = setupItemOperations(dynamo)

	return pipe(
		TE.of(id),
		TE.flatMap(getById),
		TE.map(OkResult),
		TE.getOrElseW(flow((x) => x.type, BadResult, T.of))
	)()
}

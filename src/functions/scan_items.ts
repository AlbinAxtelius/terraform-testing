import * as T from 'fp-ts/lib/Task'
import * as TE from 'fp-ts/lib/TaskEither'
import { flow, pipe } from 'fp-ts/lib/function'
import { dynamo } from '../database/getDBClient'
import { Items, setupItemOperations } from '../entities/item'

const OkResult = (data: Items) => ({
	statusCode: 200,
	data,
})

const BadResult = (error: string) => ({
	statusCode: 400,
	error,
})

export const handler = () => {
	const { scan } = setupItemOperations(dynamo)

	return pipe(
		scan(),
		TE.map(OkResult),
		TE.getOrElseW(flow((x) => x.type, BadResult, T.of))
	)()
}

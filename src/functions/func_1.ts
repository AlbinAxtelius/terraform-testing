import type {
	APIGatewayProxyEventV2,
	APIGatewayProxyHandlerV2,
} from 'aws-lambda'
import { pipe } from 'fp-ts/lib/function'
import * as J from 'fp-ts/Json'
import * as O from 'fp-ts/Option'

const safeParseBody = (event: APIGatewayProxyEventV2) =>
	pipe(
		event.body,
		O.fromNullable,
		O.map(J.parse),
		O.flatMap(O.fromEither),
		O.getOrElseW(() => ({
			message: 'Invalid body',
		}))
	)

export const handler: APIGatewayProxyHandlerV2 = async (event, _context) => {
	return {
		statusCode: 200,
		body: JSON.stringify(safeParseBody(event)),
	}
}

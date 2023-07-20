import type { APIGatewayProxyStructuredResultV2 } from 'aws-lambda'
import * as J from 'fp-ts/Json'
import * as E from 'fp-ts/Either'
import { flow, pipe } from 'fp-ts/lib/function'

export type CreateResponseErrors = string

type SafeCreateResponse = (
	statusCode: number
) => (
	body: unknown
) => E.Either<CreateResponseErrors, APIGatewayProxyStructuredResultV2>

const safeCreateResponse: SafeCreateResponse = (statusCode: number) =>
	flow(
		J.stringify,
		E.bimap(
			(error) => String(error),
			(body) => ({
				statusCode,
				body,
			})
		)
	)

type CreateResponse = (
	statusCode: number
) => (body: unknown) => APIGatewayProxyStructuredResultV2

const createResponse: CreateResponse = (statusCode: number) =>
	flow(
		J.stringify,
		E.map((body) => ({
			statusCode,
			body,
		})),
		E.getOrElse(() => ({
			statusCode: 500,
			body: JSON.stringify({ message: 'Internal server error' }),
		}))
	)

export const safeSuccessResponse = safeCreateResponse(200)
export const successResponse = createResponse(200)

export const safeBadRequestResponse = safeCreateResponse(400)
export const badRequestResponse = createResponse(400)

export const safeNotFoundResponse = safeCreateResponse(404)
export const notFoundResponse = createResponse(404)

export const safeServerError = safeCreateResponse(500)
export const serverError = createResponse(500)

import * as E from 'fp-ts/Either'
import z from 'zod'

export type ParsingError = { type: 'PARSING_ERROR' }
export const PARSING_ERROR: ParsingError = { type: 'PARSING_ERROR' }

export const parseValues =
	<S extends z.ZodType>(schema?: S) =>
	(
		data: unknown
	): E.Either<ParsingError, S extends undefined ? any : z.infer<S>> =>
		E.tryCatch(
			() => {
				const s = schema || z.any()
				return s.parse(data)
			},
			(_error) => PARSING_ERROR
		)

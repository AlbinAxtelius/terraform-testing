import * as E from 'fp-ts/Either'
import { flow } from 'fp-ts/lib/function'
import z from 'zod'

type SafeParseWithSchema = <S extends z.ZodType>(
	schema: S
) => (body: unknown) => E.Either<string, z.infer<S>>

const safeParseWithSchema: SafeParseWithSchema = (schema) => (obj) =>
	E.tryCatch(
		() => schema.parse(obj),
		() => 'Parsing error'
	)

const schema = z.object({
	name: z.string(),
	age: z.number(),
})

const doThings = flow(
	safeParseWithSchema(schema),
	E.map(({ age, name }) => `Hello ${name}, you are ${age} years old`),
	E.getOrElse((e) => e)
)

export const handler = async (event: unknown) => {
	return {
		statusCode: 200,
		body: JSON.stringify(doThings(event)),
	}
}

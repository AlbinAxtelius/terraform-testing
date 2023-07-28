/**
 * ### Description
 *
 * This type exists just to make sure the correct keys exists on the object.
 *
 * Typings for the operations will be inferred when used like the example below.
 *
 * ### Usage example
 * ```typescript
 * const operations = { ... } satisfies DatabaseOperations
 * ```
 */
export type DatabaseOperations = {
	getById: unknown
	scan: unknown
	create: unknown
}

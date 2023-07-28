export const log = <T>(v: T): T => {
	console.log(v)
	return v
}

export const logW =
	(label: string) =>
	<T>(v: T): T => {
		console.log(`${label}:`, v)
		return v
	}

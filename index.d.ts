export {}

declare global {
	namespace NodeJS {
		interface ProcessEnv {
			ITEMS_TABLE: string
			NOTES_TABLE: string
		}
	}
}

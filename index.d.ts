export {}

declare global {
	namespace NodeJS {
		interface ProcessEnv {
			TABLE_NAME: string
			AWS_ACCESS_KEY_ID: string
			AWS_SECRET_ACCESS_KEY: string
			AWS_SESSION_TOKEN: string
		}
	}
}

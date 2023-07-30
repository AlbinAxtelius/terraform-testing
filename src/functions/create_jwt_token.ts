import type { APIGatewayAuthorizerEvent } from 'aws-lambda'
import jwt from 'jsonwebtoken'
import {
	SecretsManagerClient,
	GetSecretValueCommand,
} from '@aws-sdk/client-secrets-manager'
import { fromEnv } from '@aws-sdk/credential-providers'

const secrets = new SecretsManagerClient({
	region: 'eu-central-1',
	credentials: fromEnv(),
})

export const handler = async () => {
	const getCommand = new GetSecretValueCommand({ SecretId: 'asm-test' })

	const signingKey = await secrets.send(getCommand)

	console.log(signingKey.SecretString)

	const token = jwt.sign({ me: 'cool' }, 'very_secret_key', {
		algorithm: 'HS256',
	})

	console.log(token)

	return { token }
}

// Local imports
import { auth } from 'helpers/firebase'





export async function verifyAuthorization(authToken, request, response) {
	try {
		const result = await auth.verifyIdToken(authToken.replace(/^Bearer /, ''), true)

		if (!result.email_verified) {
			response.setHeader('WWW-Authenticate', 'Bearer realm="game data channel", message="verification_required"')
			return 401
		}
		// console.log(result)

		return result
	} catch (error) {
		switch (error.errorInfo.code) {
			case 'auth/argument-error':
				response.setHeader('WWW-Authenticate', 'Bearer realm="game data channel", message="invalid_token"')
				return 401

			case 'auth/id-token-expired':
				response.setHeader('WWW-Authenticate', 'Bearer realm="game data channel", message="expired_token"')
				return 401

			default:
				return 500
		}
	}
}

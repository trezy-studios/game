// Module imports
import geckos from '@geckos.io/server'





// Local imports
import { verifyAuthorization } from 'helpers/verifyAuthorization'





// Constants
const IO = geckos({
	authorization: verifyAuthorization,
	cors: {
		allowAuthorization: true,
	},
})

IO.onConnection(channel => {
	channel.onDisconnect(() => {
		console.log(`${channel.id} got disconnected`)
	})

	channel.on('chat', data => {
		console.log(`got ${data} from "chat"`)
		// emit the "chat" data to all channels in the same room
		IO.room(channel.roomId).emit('chat', data)
	})
})

IO.listen(process.env.PORT || 3001)

// Module imports
import {
	useEffect,
	useState,
} from 'react'





export function useGame(canvasRef) {
	const canvasElement = canvasRef.current
	const [Game, setGame] = useState(null)

	useEffect(async () => {
		if (typeof window === 'undefined') {
			return
		}

		const localGame = await import('game/Game')

		setGame(localGame)
	}, [setGame])

	useEffect(() => {
		if (!Game || !canvasElement) {
			return
		}

		console.log({Game})
		Game.initialize({ canvasElement })
	}, [canvasElement])
}

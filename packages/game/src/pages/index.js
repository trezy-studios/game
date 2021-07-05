// Module imports
import {
	useEffect,
	useRef,
} from 'react'





// Local imports
import { useGame } from 'hooks/useGame'





export default function HomePage() {
	const canvasRef = useRef(null)

	useGame(canvasRef)

	return (
		<canvas ref={canvasRef} />
	)
}

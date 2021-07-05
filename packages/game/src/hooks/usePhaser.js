// Module imports
import {
	useEffect,
	useState,
} from 'react'





export function usePhaser() {
	const [Phaser, setPhaser] = useState(null)

	useEffect(async () => {
		if (typeof window === 'undefined') {
			return
		}

		const localPhaser = await import('phaser')

		setPhaser(localPhaser)
	}, [setPhaser])

	return Phaser
}

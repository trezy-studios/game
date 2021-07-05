// Module imports
import fs from 'fs/promises'
import path from 'path'
import xml from 'xml-obj'





// Local imports
import { World } from './structures/World.js'





const assetsPath = path.resolve('..', 'world')
const worldsPath = path.resolve(assetsPath, 'worlds')

;(async function () {
	const worldsDirectoryContents = await fs.readdir(worldsPath)
	const worldFilenames = worldsDirectoryContents.filter(filename => filename.endsWith('.world'))

	const worlds = worldFilenames.map(filename => new World({
		assetsPath,
		filename,
	}))

	await Promise.all(worlds.map(world => world.load()))

	console.log(`Loaded worlds: ${worlds.map(({ maps, name }) => `${name} (${maps.length} maps)`).join(', ')}`)

	let currentTick = 0

	const tick = () => {
		console.log(`tick ${currentTick}`)
		worlds.forEach(world => world.update())
		currentTick += 1
	}

	// tick()

	setInterval(tick, 1000)

	// while (true) {
	// 	tick()
	// }
})()

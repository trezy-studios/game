// Module imports
import fs from 'fs/promises'
import path from 'path'
import xml from 'xml-obj'





// Local imports
import { Spawn } from './Spawn.js'





export class World {
	entities = {}
	spawns = []
	worldFileContents = null

	constructor(options) {
		// const {
		// 	assetsPath,
		// 	filename,
		// } = options

		this.options = options
	}

	destroyEntity = entity => {
		delete this.entities[entity.id]
	}

	load = async () => {
		const worldsPath = path.resolve(this.assetsPath, 'worlds')
		const worldFilePath = path.resolve(worldsPath, this.filename)
		const worldFileContents = await fs.readFile(worldFilePath, 'utf8')

		this.worldFileContents = {
			name: this.filename.replace(/\.world$/, ''),
			...JSON.parse(worldFileContents),
		}

		await Promise.all(this.maps.map(async mapData => {
			const mapFilePath = path.resolve(worldsPath, mapData.fileName)
			const mapFileContents = await fs.readFile(mapFilePath, 'utf8')
			let {
				map: {
					objectgroup: objectLayers = [],
				},
			} = xml.parse(mapFileContents)

			if (objectLayers) {
				if (!Array.isArray(objectLayers)) {
					objectLayers = [objectLayers]
				}

				objectLayers.forEach(objectLayer => {
					objectLayer.object.forEach(object => {
						if (object['-type'].startsWith('spawn::')) {
							const spawn = Spawn.fromTiledObject(object)
							spawn.setWorld(this)
							this.spawns.push(spawn)
						}
					})
				})
			}
		}))
	}

	update = () => {
		this.updateEntities()
		this.updateSpawns()
	}

	updateEntities = () => {
		this.entities
	}

	updateSpawns = () => {
		this.spawns.forEach(spawn => spawn.tick())
	}





	/****************************************************************************\
	 * Getters
	\****************************************************************************/

	get assetsPath() {
		return this.options.assetsPath
	}

	get filename() {
		return this.options.filename
	}

	get maps() {
		return this.worldFileContents.maps
	}

	get name() {
		return this.worldFileContents.name
	}
}

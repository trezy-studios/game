// Local imports
import {
	SPAWN_DENSITY,
	SPAWN_RATE,
} from '../data/constants.js'
import { Entity } from './Entity.js'





export class Spawn {
	/****************************************************************************\
	 * Static
	\****************************************************************************/

	static fromTiledObject(spawnData) {
		const spawnObject = {
			id: parseInt(spawnData['-id']),
			type: spawnData['-type'].replace(/^spawn::/, ''),
			x: Math.floor(spawnData['-x']),
			y: Math.floor(spawnData['-y']),
		}

		if (spawnData.properties) {
			spawnData.properties.property.forEach(propertyData => {
				spawnObject[propertyData['-name']] = propertyData['-value']
			})
		}

		return new Spawn(spawnObject)
	}





	/****************************************************************************\
	 * Instance
	\****************************************************************************/

	entities = []
	lastUpdate = performance.now()
	world = null

	constructor(options = {}) {
		this.options = options
	}

	destroyEntity = entity => {
		this.entities = this.entities.filter(testEntity => (testEntity === entity))
		this.world.destroyEntity(entity)
	}

	setWorld = world => {
		this.world = world
	}

	spawnEntity = () => {
		this.entities.push(new Entity({
			spawn: this,
			type: this.type,
		}))
		console.log(`[spawn ${this.id}] Spawned new entity; total entities is currently ${this.entities.length}.`)
	}

	tick() {
		const now = performance.now()
		if (this.lastUpdate) {
			const spawnDensity = SPAWN_DENSITY[this.spawnDensity]

			if (this.entities.length >= spawnDensity) {
				return
			}

			const spawnRate = SPAWN_RATE[this.spawnRate]
			const nextUpdate = this.lastUpdate + spawnRate

			if (nextUpdate > now) {
				return
			}
		}

		this.spawnEntity()

		this.lastUpdate = now
	}

	get id() {
		return this.options.id
	}

	get spawnDensity() {
		return this.options.spawnDensity || 'MEDIUM'
	}

	get spawnRate() {
		return this.options.spawnRate || 'MEDIUM'
	}

	get type() {
		return this.options.type
	}

	get x() {
		return this.options.x
	}

	get y() {
		return this.options.y
	}
}

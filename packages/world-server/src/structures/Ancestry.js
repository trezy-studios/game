// Local imports
import * as ANCESTRIES from '../data/ancestries/index.js'





export class Ancestry {
	type = null

	constructor(type) {
		this.type = type
		const baseAncestry = ANCESTRIES[type]

		this.parseBaseAncestry(baseAncestry)

		Object.entries(baseAncestry.baseStats).forEach(([stat, value]) => {
			this[stat] = value
		})
	}

	parseBaseAncestry(baseAncestry) {
		const requiredStats = [
			'hp',
			'speed',
		]

		const missingStats = []

		requiredStats.forEach(stat => {
			if (!baseAncestry.baseStats[stat]) {
				missingStats.push(stat)
			}
		})

		if (missingStats.length) {
			throw new Error(`[ancestry::${this.type}] Missing stats: ${missingStats.join(', ')}`)
		}
	}
}

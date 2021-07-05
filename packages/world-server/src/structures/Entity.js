// Local imports
import { getID } from '../libraries/IDGEN.js'
import { Ancestry } from './Ancestry.js'





export class Entity {
	/****************************************************************************\
	 * Instance
	\****************************************************************************/

	ancestry = null
	hp = 0
	id = getID()
	isDead = false
	profession = null

	constructor(options = {}) {
		this.options = options
		this.getAncestry()
		this.getProfession()
	}

	destroy() {
		this.isDead = true
		this.spawn.destroyEntity(this)
	}

	getAncestry = () => {
		this.ancestry = new Ancestry(this.type)
	}

	getProfession = () => {
		// this.profession = new Profession(this.options.profession)
	}

	kill() {
		this.isDead = true
	}





	/****************************************************************************\
	 * Getters
	\****************************************************************************/

	get spawn() {
		return this.options.spawn
	}

	get type() {
		return this.options.type
	}
}

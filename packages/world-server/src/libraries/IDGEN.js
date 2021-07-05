// Local constants
const IDGEN = (function* generateID() {
	while (true) {
		const id = Math.floor(Math.random() * 100000000000).toString(16)
		if (!IDS_CACHE[id]) {
			yield id
		}
	}
})()
const IDS_CACHE = {}

export function getID() {
	return IDGEN.next().value
}

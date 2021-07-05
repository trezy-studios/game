// Module imports
import Phaser from 'phaser'





// Constants

/* Game data */
const GAME_SCALE = 4
const MAPS = [
	'Lostglen',
]

/* Character props */
const BASE_SPEED = 150

/* Character types */
const ANCESTRIES = [
	'humans',
]
const PROFESSIONS = [
	'archer',
	'knight',
	'pikeman',
	'priest',
	'swordsman',
]

/* Spritesheets */
const PORTRAIT_OFFSET = 2
const SPRITE_ROW_LENGTH = 22
const CREATURE_SPRITESHEETS = [
	{
		name: 'humans',
		path: 'assets/HAS2020/Creatures/Humans/HumansSpriteSheet.png',
		hasSpecials: false,
		characters: [
			{
				name: 'archer',
				row: 2,
			},

			{
				name: 'knight',
				row: 7,
			},

			{
				name: 'pikeman',
				row: 1,
			},

			{
				name: 'priest',
				row: 5,
			},

			{
				name: 'swordsman',
				row: 4,
			},
		],
	},
]
const CREATURE_SPRITESHEET_ANIMATIONS = [
	{
		name: 'attack',
		frameRate: 6,
		start: 8,
		end: 11,
	},
	{
		name: 'death',
		start: 16,
		end: 19,
	},
	{
		name: 'hit',
		start: 12,
		end: 15,
	},
	{
		name: 'idle',
		start: 0,
		end: 3,
	},
	{
		name: 'special',
		start: 20,
		end: 23,
	},
	{
		name: 'walk',
		start: 4,
		end: 7,
	},
]

const GAME_CACHE = {
	characterSheet: {
		ancestry: 'humans',
		profession: 'knight',
		speedModifier: 0,
	},
	currentMapName: 'Lostglen',
	game: null,
	keys: null,
	currentPlayer: null,
}





class BootScene extends Phaser.Scene {
	key = 'BootScene'

	create() {
		this.scene.start('WorldScene')
	}

	preload() {
		CREATURE_SPRITESHEETS.forEach(spritesheet => {
			this.load.spritesheet(
				spritesheet.name,
				spritesheet.path,
				{
					frameHeight: 16,
					frameWidth: 16,
				},
			)
		})

		// this.load.image('sky', 'assets/sky.png')
		// this.load.image('ground', 'assets/platform.png')
		// this.load.image('star', 'assets/star.png')
		// this.load.image('bomb', 'assets/bomb.png')
		// this.load.spritesheet('dude',
		// 	'assets/dude.png',
		// 	{
		// 		frameHeight: 48,
		// 		frameWidth: 32,
		// 	},
		// )
	}
}

class WorldScene extends Phaser.Scene {
	key = 'WorldScene'

	create() {
		this.setupKeybinds()
		this.setupSpritesheetAnimations()
		this.setupMap()
		this.setupEnemies()
		this.setupPlayer()
	}

	getValidLocation = () => {
		const location = {
			x: 0,
			y: 0,
		}
		let validLocation = false

		while (!validLocation) {
			location.x = Phaser.Math.RND.between(0, this.physics.world.bounds.width)
			location.y = Phaser.Math.RND.between(0, this.physics.world.bounds.height)

			let occupied = GAME_CACHE.spawns.getChildren().some(child => {
				return child.getBounds().contains(location.x, location.y)
			})

			if (!occupied) {
				validLocation = true
			}
		}

		return location
	}

	loadCreatureSpritesheet = spritesheet => {
		this.load.spritesheet(
			spritesheet.name,
			spritesheet.path,
			{
				frameHeight: 16,
				frameWidth: 16,
			},
		)
	}

	loadCreatureSpritesheets = () => CREATURE_SPRITESHEETS.forEach(this.loadCreatureSpritesheet)

	loadMap = mapName => {
		const mapKey = `map::${mapName}`

		this.load.tilemapTiledJSON({
			key: mapKey,
			url: `assets/maps/${mapName}.json`,
		})

		this.load.once(`filecomplete-tilemapJSON-${mapKey}`, this.loadTilesetImages)
	}

	loadMaps = () => MAPS.forEach(this.loadMap)

	loadTilesetImages = (baseMapKey, _, { data }) => {
		const { tilesets } = data
		tilesets.forEach(tileset => {
			const imageKey = `${baseMapKey}::tilesetImage::${tileset.name}`
			const imageURL = tileset.image.replace(/^\.\./, '/assets')
			this.load.image(imageKey, imageURL)
		})
	}

	// loadTilesets = (baseMapKey, _, { data }) => {
	// 	const mapName = baseMapKey.replace(/^map::/, '')

	// 	// data.tilesets.forEach(tileset => {
	// 	// 	console.log({mapName, baseMapKey})
	// 	// 	const pathAsArray = tileset.source.replace(/^\.\.\//, '').split('/')
	// 	// 	const tilesetName = pathAsArray[pathAsArray.length - 1].replace(/\.tsx$/, '')
	// 	// 	const tilesetKey = `tileset::${mapName}::${tilesetName}`

	// 	// 	this.load.xml({
	// 	// 		key: tilesetKey,
	// 	// 		url: `/assets/${pathAsArray.join('/')}`,
	// 	// 	})

	// 	// 	this.load.once(`filecomplete-xml-${tilesetKey}`, this.loadTilesetSprites)
	// 	// })
	// }

	// loadTilesetSprites = (baseTilesetKey, _, data) => {
	// 	const { firstChild: tileset } = data

	// 	const imageElement = Array.from(tileset.childNodes).find(node => node.nodeName === 'image')
	// 	const imageURL = imageElement.attributes.source.value.replace(/^\.\.\//, '/assets/')
	// 	const imageKey = baseTilesetKey.replace(/^tileset/, 'tilesetImage')

	// 	// console.log('loadTilesetSprites', {
	// 	// 	baseTilesetKey,
	// 	// 	data,
	// 	// 	imageElement,
	// 	// 	imageURL,
	// 	// })

	// 	this.load.image(imageKey, imageURL)
	// }

	onMeetEnemy = (player, zone) => {
		console.log('onMeetEnemy', player, zone)
		// this.cameras.main.shake(16)
	}

	preload() {
		// Map assets
		this.loadMaps()
		this.loadCreatureSpritesheets()
	}

	setupEnemies = () => {
		// const { currentPlayer } = GAME_CACHE

		const spawns = this.physics.add.group({ classType: Phaser.GameObjects.Sprite })

		GAME_CACHE.spawns = spawns

		for (let i = 0; i < 30; i += 1) {
			const location = this.getValidLocation()
			const x = Phaser.Math.RND.between(0, this.physics.world.bounds.width)
			const y = Phaser.Math.RND.between(0, this.physics.world.bounds.height)

			// parameters are x, y, width, height
			const enemy = spawns.create(location.x, location.y, 16, 16)
			enemy.body.setCollideWorldBounds(true)
			enemy.body.setImmovable()
		}

		// this.physics.add.overlap(currentPlayer, spawns, this.onMeetEnemy, false, this)
	}

	setupKeybinds = () => {
		GAME_CACHE.keys = this.input.keyboard.addKeys({
			'attack': Phaser.Input.Keyboard.KeyCodes.SPACE,
			'down': Phaser.Input.Keyboard.KeyCodes.S,
			'left': Phaser.Input.Keyboard.KeyCodes.A,
			'right': Phaser.Input.Keyboard.KeyCodes.D,
			'up': Phaser.Input.Keyboard.KeyCodes.W,
		})
	}

	setupMap = () => {
		GAME_CACHE.currentMap = this.make.tilemap({
			key: `map::${GAME_CACHE.currentMapName}`,
		})
		// GAME_CACHE.currentMap.setScale(GAME_SCALE)

		const availableTilesets = []

		GAME_CACHE.currentMap.tilesets.forEach(tilesetData => {
			const tilesetKey = `map::${GAME_CACHE.currentMapName}::tilesetImage::${tilesetData.name}`
			const tileset = GAME_CACHE.currentMap.addTilesetImage(tilesetData.name, tilesetKey)
			// console.log({tileset})
			// Object.entries(tileset.tileData)
			availableTilesets.push(tileset)
			// const objectLayer = new Phaser.Tilemaps.ObjectLayer({

			// })
		})

		GAME_CACHE.currentMap.layers.forEach(layerData => {
			// console.log(layerData)
			const layer = GAME_CACHE.currentMap.createLayer(layerData.name, availableTilesets)
			// console.log({layer})
		})
	}

	setupPlayer = () => {
		const container = this.add.container(100, 450)
		const player = this.add.sprite(0, 0, 'humans')

		GAME_CACHE.currentPlayerContainer = container
		GAME_CACHE.currentPlayer = player

		container.setSize(16, 16)
		container.add(player)

		this.physics.world.enable(container)

		container.body.setCollideWorldBounds(true)

		this.updateCamera()

		// player.setScale(GAME_SCALE)

		this.physics.add.collider(container, GAME_CACHE.spawns)
	}

	setupSpritesheetAnimations = () => {
		CREATURE_SPRITESHEETS.forEach(spritesheet => {
			spritesheet.characters.forEach(spritesheetCharacter => {
				const FRAME_OFFSET = SPRITE_ROW_LENGTH * spritesheetCharacter.row

				CREATURE_SPRITESHEET_ANIMATIONS.forEach(animationData => {
					if ((animationData.name === 'special') && !spritesheet.hasSpecials) {
						return
					}

					this.anims.create({
						key: `${spritesheet.name}::${spritesheetCharacter.name}::${animationData.name}`,
						frames: this.anims.generateFrameNumbers(spritesheet.name, {
							start: FRAME_OFFSET + PORTRAIT_OFFSET + animationData.start,
							end: FRAME_OFFSET + PORTRAIT_OFFSET + animationData.end,
						}),
						frameRate: animationData.frameRate || 7,
						repeat: -1,
					})
				})
			})
		})
	}

	update() {
		const {
			characterSheet,
			currentPlayer,
			currentPlayerContainer,
			keys,
		} = GAME_CACHE

		const isAttacking = keys.attack.isDown
		const isMovingHorizontally = -Number(keys.left.isDown) + Number(keys.right.isDown)
		const isMovingVertically = Number(keys.down.isDown) + -Number(keys.up.isDown)

		// Handle velocity when moving at an angle
		const magnitude = Math.sqrt((isMovingHorizontally ** 2) + (isMovingVertically ** 2))
		const speed = (BASE_SPEED + characterSheet.speedModifier) / magnitude

		if (isMovingHorizontally) {
			currentPlayerContainer.flipX = isMovingHorizontally < 0
			currentPlayerContainer.body.setVelocityX(speed * isMovingHorizontally)
		} else {
			currentPlayerContainer.body.setVelocityX(0)
		}

		if (isMovingVertically) {
			currentPlayerContainer.body.setVelocityY(speed * isMovingVertically)
		} else {
			currentPlayerContainer.body.setVelocityY(0)
		}

		if (isAttacking) {
			currentPlayer.anims.play(`${characterSheet.ancestry}::${characterSheet.profession}::attack`, true)
		} else if (isMovingVertically || isMovingHorizontally) {
			currentPlayer.anims.play(`${characterSheet.ancestry}::${characterSheet.profession}::walk`, true)
		} else {
			currentPlayer.anims.play(`${characterSheet.ancestry}::${characterSheet.profession}::idle`, true)
		}
	}

	updateCamera() {
		const {
			currentMap,
			currentPlayerContainer,
		} = GAME_CACHE

		this.cameras.main.setBounds(0, 0, currentMap.widthInPixels, currentMap.heightInPixels)
		this.cameras.main.startFollow(currentPlayerContainer)
		this.cameras.main.roundPixels = true // avoid tile bleed
	}
}

export function initialize(options) {
	const { canvasElement } = options

	GAME_CACHE.game = new Phaser.Game({
		canvas: canvasElement,
		height: 600,
		physics: {
			default: 'arcade',
			arcade: {
				debug: true,
				gravity: 0,
			},
		},
		render: {
			pixelArt: true,
		},
		scene: [
			// new BootScene,
			new WorldScene,
		],
		type: Phaser.CANVAS,
		width: 800,
	})
}

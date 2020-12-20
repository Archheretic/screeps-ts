// import { uuidv4 } from './utils';
import RoomSettings from './RoomSettings';

const Spawner = {
	spawnAll() {
		const names = ['Randy', 'Cartman', 'Kyle', 'Kenny', 'Stan', 'Butters'];
		const roomSpawnsMap = getRoomSpawnsMap();
		const population = getPopulation();
		Object.keys(Game.rooms).forEach(roomName => {
			const roomSettings = RoomSettings[roomName];
			const spawnsInRoom = roomSpawnsMap[roomName];
			const popInRoom = population[roomName];
			console.log('popInRoom:', JSON.stringify(popInRoom, null, 2));
			Object.keys(spawnsInRoom).forEach((sp, index) => {
				// find first unused name, if no name is available give random number as name
				const name = !Memory.creeps ? names[0] : names.find(name => !!!Memory.creeps[name]) || Math.random().toString();//uuidv4();
				roomSettings.rolePriority.forEach(role => {
					// if there are less creeps spawned in the room then what is ideal spawn a new creep.
					if (popInRoom[role] < roomSettings.idealPopulation[role]) {
						const roleSettings = roomSettings.roles[role];
						Game.spawns[sp].spawnCreep(roleSettings.body, name, {memory: {role, roomOrigin: roomName, spawnOrigin: sp}});
					}
				})
			})
		})
	}
}

function getRoomSpawnsMap() {
	const roomSpawnsMap: any = {};
	Object.keys(Game.rooms).forEach(roomName => {
		roomSpawnsMap[roomName] = {};
		Object.keys(Game.spawns).forEach(spawnName => {
			const spawn = Game.spawns[spawnName];
			const spawnRoom = spawn.room.name;
			if (roomName === spawnRoom) {
				roomSpawnsMap[roomName] = {
					...roomSpawnsMap[roomName],
					[spawnName]: spawn
				}
			}
		});
	});
	return roomSpawnsMap;
}

type PopulationMapType = {
	[room: string]: {
		[role: string]: number;
	}
}

function getPopulation() {
	let populationMap: PopulationMapType = createInitialRoomsPopStructure();
	Object.entries(Game.creeps).forEach(entry => {
		const [ creepName, creep ] = entry;
		const roomOrigin = creep.memory.roomOrigin;
		populationMap = {
			...populationMap,
			[roomOrigin]: {
				...populationMap[roomOrigin],
				[creep.memory.role]:  populationMap[roomOrigin]?.[creep.memory.role] +1
			},
		}
	})
	return populationMap;
}

function createInitialRoomsPopStructure() {
	let populationMap: PopulationMapType = {};
	Object.keys(Game.rooms).forEach(roomName => {
		populationMap = {
			...populationMap,
			[roomName]: {
				...populationMap[roomName],
			}
		};

		RoomSettings[roomName].rolePriority.forEach(roleName => {
			populationMap = {
				...populationMap,
				[roomName]: {
					...populationMap[roomName],
					[roleName]:	populationMap[roomName][roleName] || 0
				}
			};
		})
	})
	return populationMap;
}

export default Spawner;

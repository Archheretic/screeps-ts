// import { uuidv4 } from './utils';
import RoomSettings from './RoomSettings';

const Spawner = {
	spawnAll(): void {
		const names = ['Randy', 'Cartman', 'Kyle', 'Kenny', 'Stan', 'Butters'];
		const roomSpawnsMap = getRoomSpawnsMap();
		const population = getPopulation();
		Object.keys(Game.rooms).forEach(roomName => {
			const roomSettings = RoomSettings[roomName];
			const spawnsInRoom = roomSpawnsMap[roomName];
			const popInRoom = population[roomName];
			Object.keys(spawnsInRoom).forEach(sp => {
				// find first unused name, if no name is available give random number as name
				const name = !Memory.creeps
					? names[0]
					: names.find(n => !Memory.creeps[n]) || Math.random().toString(); // uuidv4();
				roomSettings.rolePriority.forEach(role => {
					// if there are less creeps spawned in the room then what is ideal spawn a new creep.
					if (popInRoom[role] < roomSettings.idealPopulation[role]) {
						const roleSettings = roomSettings.roles[role];
						Game.spawns[sp].spawnCreep(roleSettings.body, name, {
							memory: {
								role,
								roomOrigin: roomName,
								currentRoom: roomName,
								spawnOrigin: sp,
							},
						});
					}
				});
			});
		});
	},
};

interface RoomSpawnsMapType {
	[roomName: string]: {
		[spawnName: string]: StructureSpawn;
	};
}

function getRoomSpawnsMap(): RoomSpawnsMapType {
	const roomSpawnsMap: RoomSpawnsMapType = {};
	Object.keys(Game.rooms).forEach(roomName => {
		roomSpawnsMap[roomName] = {};
		Object.keys(Game.spawns).forEach(spawnName => {
			const spawn = Game.spawns[spawnName];
			const spawnRoom = spawn.room.name;
			if (roomName === spawnRoom) {
				roomSpawnsMap[roomName] = {
					...roomSpawnsMap[roomName],
					[spawnName]: spawn,
				};
			}
		});
	});
	return roomSpawnsMap;
}

interface PopulationMapType {
	[room: string]: {
		[role: string]: number;
	};
}

function getPopulation(): PopulationMapType {
	let populationMap: PopulationMapType = createInitialRoomsPopStructure();
	Object.values(Game.creeps).forEach(creep => {
		const roomOrigin = creep.memory.roomOrigin;
		populationMap = {
			...populationMap,
			[roomOrigin]: {
				...populationMap[roomOrigin],
				[creep.memory.role]: populationMap[roomOrigin]?.[creep.memory.role] + 1,
			},
		};
	});
	return populationMap;
}

function createInitialRoomsPopStructure(): PopulationMapType {
	let populationMap: PopulationMapType = {};
	Object.keys(Game.rooms).forEach(roomName => {
		populationMap = {
			...populationMap,
			[roomName]: {
				...populationMap[roomName],
			},
		};

		RoomSettings[roomName].rolePriority.forEach(roleName => {
			populationMap = {
				...populationMap,
				[roomName]: {
					...populationMap[roomName],
					[roleName]: populationMap[roomName][roleName] || 0,
				},
			};
		});
	});
	return populationMap;
}

export default Spawner;

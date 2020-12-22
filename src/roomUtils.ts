interface RoomSpawnsMapType {
	[spawnName: string]: StructureSpawn;
}

export function mapRoomsMemory(): void {
	Memory.rooms = {};
	const roomsPopulationMap = createRoomsPopulationMap();
	Object.keys(Game.rooms).forEach(roomName => {
		const roomPopulationMap = roomsPopulationMap[roomName];
		const room = Game.rooms[roomName];
		room.memory = {
			spawns: createRoomSpawnsMap(roomName),
			roles: roomPopulationMap.roles,
			spawned: roomPopulationMap.spawned,
			creeps: roomPopulationMap.creeps,
		};
	});
	Memory.lastMappedRoomsMemory = Game.time;
}

// export function initiateRoomMemory(roomName: string): void {
// 	const room = Game.rooms[roomName];
// 	const
// 	room.memory = {
// 		spawns: createRoomSpawnsMap(roomName),
// 		creeps: {

// 		}
// }

export function addSpawnedCreepToRoomMemory(
	roomName: string,
	creepMemory: CreepMemory,
	creepName: string
): void {
	const room = Game.rooms[roomName];
	room.memory = {
		...room.memory,
		// spawns: {
		// 	...room.memory.spawns,
		// 	[sp]: {
		// 		...room.memory?.spawns?.[sp],
		// 		// append some info on the spawn?
		// 	},
		// },
		creeps: {
			...room.memory.creeps,
			[creepName]: {
				memory: creepMemory,
			},
		},
		spawned: {
			...room.memory.spawned,
			roles: {
				...room.memory.spawned.roles,
				[creepMemory.role]: room.memory.spawned.roles[creepMemory.role]
					? room.memory.spawned.roles[creepMemory.role] + 1
					: 1,
			},
		},
	};
}

export function addCreepToRoomMemory(
	roomName: string,
	creepMemory: CreepMemory,
	creepName: string
): void {
	const room = Game.rooms[roomName];
	room.memory = {
		...room.memory,
		// spawns: {
		// 	...room.memory.spawns,
		// 	[sp]: {
		// 		...room.memory?.spawns?.[sp],
		// 		// append some info on the spawn?
		// 	},
		// },
		creeps: {
			...room.memory.creeps,
			[creepName]: {
				memory: creepMemory,
			},
		},
	};
}

export function removeCreepFromRoomMemory(
	roomName: string,
	creepName: string
): void {
	const room = Game.rooms[roomName];
	delete room.memory.creeps[creepName];
	const creep = Game.creeps[creepName];
	room.memory.spawned.roles[creep.memory.role]--;
}

interface RoomsSpawnsMapType {
	[roomName: string]: RoomSpawnsMapType;
}

export function createRoomsSpawnsMap(): RoomsSpawnsMapType {
	const roomsSpawnsMap: RoomsSpawnsMapType = {};
	Object.keys(Game.rooms).forEach(roomName => {
		const roomSpawnsMap = createRoomSpawnsMap(roomName);
		if (roomSpawnsMap) {
			roomsSpawnsMap[roomName] = roomSpawnsMap;
		}
	});
	return roomsSpawnsMap;
}

export function createRoomSpawnsMap(roomName: string): RoomSpawnsMapType {
	let roomSpawnsMap: RoomSpawnsMapType = {};
	for (const spawnName of Object.keys(Game.spawns)) {
		const spawn = Game.spawns[spawnName];
		const spawnRoom = spawn.room.name;
		if (roomName === spawnRoom) {
			roomSpawnsMap = {
				...roomSpawnsMap,
				[spawnName]: spawn,
			};
		}
	}
	return roomSpawnsMap;
}

interface RoomsPopulationMapType {
	[room: string]: RoomPopulationMapType;
}

interface RoomPopulationMapType {
	roomName: string;
	roles: {
		[role: string]: number;
	};
	spawned: {
		roles: {
			[role: string]: number;
		};
	};
	creeps: {
		[creepName: string]: {
			memory: CreepMemory;
		};
	};
}

export function createRoomsPopulationMap(): RoomsPopulationMapType {
	let popMap: RoomsPopulationMapType = {};
	Object.values(Game.creeps).forEach(creep => {
		const roomOrigin = creep.memory.roomOrigin;
		const room = creep.memory.room || creep.memory.roomOrigin;
		const temp: RoomsPopulationMapType = {
			...popMap,
			[room]: {
				...popMap[room],
				roomName: room,
				roles: {
					...popMap[room]?.roles,
					[creep.memory.role]: popMap[room]?.roles?.[creep.memory.role]
						? popMap[room]?.roles?.[creep.memory.role] + 1
						: 1,
				},
				spawned: {
					...popMap[roomOrigin]?.spawned,
					roles: {
						...popMap[roomOrigin]?.spawned.roles,
						[creep.memory.role]: popMap[room]?.roles?.[creep.memory.role]
							? popMap[room]?.roles?.[creep.memory.role] + 1
							: 1,
					},
				},
				creeps: {
					...popMap[room]?.creeps,
					[creep.name]: {
						...popMap[room]?.creeps?.[creep.name],
						memory: creep.memory,
					},
				},
			},
		};
		popMap = temp;
	});
	return popMap;
}

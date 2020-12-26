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
			sources: {
				energy: identifyRoomEnergySources(room),
			},
		};
	});
	Memory.lastMappedRoomsMemory = Game.time;
}

export function addSpawnedCreepToRoomMemory(
	creepMemory: CreepMemory,
	creepName: string
): void {
	const { roomOrigin, targetRoom: targetRoomName } = creepMemory;
	const room = Game.rooms[roomOrigin];
	const roles = {
		...room.memory.roles,
		[creepMemory.role]: room.memory.spawned.roles[creepMemory.role]
			? room.memory.spawned.roles[creepMemory.role] + 1
			: 1,
	};

	// creepMemory.sourceId;

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
		roles,
		spawned: {
			...room.memory.spawned,
			roles,
		},
	};

	const sourceId = creepMemory.sourceId;
	// if creep has a source id we need to update last spawned on the energy
	// sourceId in the target room
	// TODO: Find out if sourceId energy is specific enough to not make this bad code?
	if (sourceId) {
		const targetRoom = Game.rooms[targetRoomName];
		targetRoom.memory = {
			...targetRoom.memory,
			sources: {
				...targetRoom.memory.sources,
				energy: {
					...targetRoom.memory.sources.energy,
					[sourceId]: {
						...targetRoom.memory.sources.energy[sourceId],
						lastSpawn: Game.time,
					},
				},
			},
		};
	}
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

export function removeCreepFromRoomMemory(creepName: string): void {
	// console.log('roomName:', roomName);
	const creepMemory = Memory.creeps[creepName];
	const room = Game.rooms[creepMemory.room];
	const roomOrigin = Game.rooms[creepMemory.roomOrigin];

	// console.log('room:', room);
	// this one needs to be from room
	room.memory.roles[creepMemory.role]--;
	// this one needs to be from roomOrigin
	roomOrigin.memory.spawned.roles[creepMemory.role]--;
	delete room.memory.creeps[creepName];
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
	// only works if there is a any creeps.
	Object.values(Game.creeps).forEach(creep => {
		const roomOrigin = creep.memory.roomOrigin;
		const room = creep.memory.room;
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
	if (!Object.keys(Game.creeps).length) {
		let temp1: RoomsPopulationMapType = {};
		Object.values(Game.rooms).forEach(room => {
			const temp2: RoomsPopulationMapType = {
				...temp1,
				[room.name]: {
					roomName: room.name,
					roles: {},
					spawned: {
						roles: {},
					},
					creeps: {},
				},
			};
			temp1 = temp2;
		});
		popMap = temp1;
	}
	return popMap;
}

export function periodicRoomChecks(room: Room, roomIndex: number): void {
	if ((Game.time + roomIndex) % 500 === 0) {
		setRoomEnergySources(room);
	}
}

interface RoomSourceMemoryType {
	[id: string]: {
		lastSpawn: number;
		sourceId: Id<Source>;
	};
}

function identifyRoomEnergySources(room: Room): RoomSourceMemoryType {
	const sources = room.find(FIND_SOURCES);
	const energiSources: RoomSourceMemoryType = sources
		.filter(source => source.energy)
		.reduce((map: RoomSourceMemoryType, source) => {
			map[source.id] = {
				lastSpawn: 0,
				sourceId: source.id,
			};
			return map;
		}, {});
	return energiSources;
}

function setRoomEnergySources(room: Room): void {
	room.memory.sources.energy = identifyRoomEnergySources(room);
}

// example declaration file - remove these and add your own custom typings

// memory extension samples
interface CreepMemory {
	role: string;
	roomOrigin: string;
	spawnOrigin: string;
	working?: boolean;
	sourceId?: Id<Source>;
	room: string;
	targetRoom: string;
}

interface Memory {
	creeps: {
		[creepName: string]: CreepMemory;
	};
	rooms: {
		[roomName: string]: RoomMemory;
	};
	lastMappedRoomsMemory: number;
	uuid: number;
	log: any;
}

interface RolesNumbersType {
	[role: string]: number;
}

interface RoomMemory {
	spawns: RoomSpawnsMapType;
	creeps: {
		[name: string]: {
			memory: CreepMemory;
		};
	};
	spawned: {
		roles: RolesNumbersType;
	};
	roles: RolesNumbersType;
	sources: {
		energy: {
			[sourceId: string]: {
				sourceId: Id<Source>;
				// Game.getObjectById(sourceId);
				lastSpawn: number;
			};
		};
	};
}

// `global` extension samples
declare namespace NodeJS {
	interface Global {
		log: any;
	}
}

interface RoomSpawnsMapType {
	[spawnName: string]: StructureSpawn;
}

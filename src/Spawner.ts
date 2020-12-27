// import { uuidv4 } from './utils';
// import { roomDefense } from 'roomDefense';
import {
	RolesNumbersType,
	RolesType,
	RoomSettingsType,
	RoomsSettings,
	Settings,
	names,
} from './Settings';
import { addBlockerToFlag } from 'flagUtils';
import { addSpawnedCreepToRoomMemory } from 'roomUtils';

const Spawner = {
	spawnAll(room: Room): void {
		const roomName = room.name;
		// const roomSpawnsMap = getRoomSpawnsMap();
		// const population = getPopulation();
		const roomSettings = RoomsSettings[roomName];
		const spawnsInRoom = room.memory.spawns;
		const popInRoom = room.memory.spawned.roles;
		Object.keys(spawnsInRoom).forEach(sp => {
			const spawn = Game.spawns[sp];
			if (spawn.spawning) {
				// if spawn is already spawning it does not have the capacity to spawn multiple in parallel
				// so we stop here to save spawn
				return;
			}
			// find first unused name, if no name is available give random number as name
			roomSettings.rolePriority.forEach((role, rolePriorityIndex) => {
				// if there are less creeps spawned in the room then what is ideal spawn a new creep.
				if (
					shouldRoleBeSpawned(
						role,
						popInRoom,
						roomSettings,
						room,
						rolePriorityIndex
					)
				) {
					const creepName = !Memory.creeps
						? names[0]
						: names.find(n => !Memory.creeps[n]) || Math.random().toString(); // uuidv4();

					const bodyPartRatio =
						roomSettings.roles?.[role]?.bodyPartRatio ||
						Settings.roles[role].bodyPartRatio;

					const creepMemory: CreepMemory = {
						role,
						roomOrigin: roomName,
						spawnOrigin: sp,
						room: roomName,
						targetRoom: roomName,
					};

					appendMemoryBasedOnRole(creepMemory);

					const creepSpawnedStatus = spawn.spawnCreep(
						getBody(bodyPartRatio, room, role),
						creepName,
						{
							memory: creepMemory,
						}
					);
					if (creepSpawnedStatus === OK) {
						// append to room memory
						addSpawnedCreepToRoomMemory(creepMemory, creepName);
						if (creepMemory.role === 'blocker') {
							addBlockerToFlag(creepMemory);
						}
					}
				}
			});
		});
	},
};

function shouldRoleBeSpawned(
	role: RolesType,
	popInRoom: RolesNumbersType,
	roomSettings: RoomSettingsType,
	room: Room,
	rolePriorityIndex: number
): boolean {
	if (
		!hasMoreImportantRolesBeenFilled(
			role,
			popInRoom,
			roomSettings,
			rolePriorityIndex
		)
	) {
		return false;
	}

	if (role === 'miner') {
		const energy = room.memory.sources.energy;
		for (const source of Object.values(energy)) {
			if (Game.time - source.lastSpawn >= CREEP_LIFE_TIME) {
				return true;
			}
		}
		return false;
	}

	if (role === 'blocker') {
		const flags = room.find(FIND_FLAGS);
		for (const flag of flags) {
			if (flag.name.includes('block')) {
				const lastSpawn = flag.memory.blocker?.lastSpawn;
				if (!lastSpawn || Game.time - lastSpawn >= CREEP_LIFE_TIME) {
					return true;
				}
			}
		}
		return false;
	}

	// other roles
	return (
		popInRoom[role] < roomSettings.idealPopulation[role] ||
		(popInRoom[role] === undefined && roomSettings.idealPopulation[role] > 0)
	);
}

function hasMoreImportantRolesBeenFilled(
	role: RolesType,
	popInRoom: RolesNumbersType,
	roomSettings: RoomSettingsType,
	rolePriorityIndex: number
): boolean {
	if (rolePriorityIndex === 0) {
		return true;
	}
	for (let i = 0; i < rolePriorityIndex; i++) {
		if (
			roomSettings.idealPopulation[roomSettings.rolePriority[i]] <
			popInRoom[role]
		) {
			return false;
		}
	}
	return true;
}

function appendMemoryBasedOnRole(creepMemory: CreepMemory): void {
	const { role, targetRoom } = creepMemory;
	if (role === 'miner') {
		const room = Game.rooms[targetRoom];
		const energy = room.memory.sources.energy;
		for (const source of Object.values(energy)) {
			if (Game.time - source.lastSpawn >= CREEP_LIFE_TIME) {
				creepMemory.sourceId = source.sourceId;
				break;
			}
		}
	}
}

function getBody(
	bodyPartRatio: BodyPartConstant[],
	room: Room,
	role: RolesType
) {
	if (role === 'blocker') {
		return [MOVE];
	}
	if (room.energyAvailable < 300 && !Object.keys(room.memory.creeps).length) {
		return getMinimalBody(bodyPartRatio);
	}
	return getIdealBody(bodyPartRatio, room);
}

interface BodyPartKeyValuePair {
	[bodyPart: string]: BodyPartConstant;
}

function getMinimalBody(bodyPartRatio: BodyPartConstant[]): BodyPartConstant[] {
	const basicBodyParts: BodyPartKeyValuePair = {
		[WORK]: WORK,
		[CARRY]: CARRY,
		[MOVE]: MOVE,
	};
	let isBodyOnlyOfBasicParts = true;
	for (const bp of bodyPartRatio) {
		if (basicBodyParts[bp]) {
			isBodyOnlyOfBasicParts = false;
			break;
		}
	}
	if (isBodyOnlyOfBasicParts) {
		return [WORK, CARRY, MOVE];
	} else {
		return bodyPartRatio;
	}
}

function getIdealBody(
	bodyPartRatio: BodyPartConstant[],
	room: Room
): BodyPartConstant[] {
	const energyCapacityAvailable = room.energyCapacityAvailable;
	let ratioCost = 0;
	bodyPartRatio.forEach(bp => {
		ratioCost += BODYPART_COST[bp];
	});
	const maxSegments = Math.floor(energyCapacityAvailable / ratioCost);
	const body: BodyPartConstant[] = [];
	for (let i = 1; i <= maxSegments; i++) {
		body.push(...bodyPartRatio);
	}
	return body;
}

export default Spawner;

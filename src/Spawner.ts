// import { uuidv4 } from './utils';
// import { roomDefense } from 'roomDefense';
import { RoomSettings, Settings } from './Settings';
import { addSpawnedCreepToRoomMemory } from 'roomUtils';

const Spawner = {
	spawnAll(room: Room): void {
		const names = [
			'Randy',
			'Cartman',
			'Kyle',
			'Kenny',
			'Stan',
			// 'Butters',
			'Token',
			'Mr(s). Garrison',
			'Mr. Mackey',
			'Mr. Slave',
		];
		const roomName = room.name;
		// const roomSpawnsMap = getRoomSpawnsMap();
		// const population = getPopulation();
		const roomSettings = RoomSettings[roomName];
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
			roomSettings.rolePriority.forEach(role => {
				// if there are less creeps spawned in the room then what is ideal spawn a new creep.
				if (
					popInRoom[role] < roomSettings.idealPopulation[role] ||
					(popInRoom[role] === undefined &&
						roomSettings.idealPopulation[role] > 0)
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
					};

					const creepSpawnedStatus = spawn.spawnCreep(
						getBody(bodyPartRatio, room),
						creepName,
						{
							memory: creepMemory,
						}
					);
					if (creepSpawnedStatus === OK) {
						// append to room memory
						addSpawnedCreepToRoomMemory(roomName, creepMemory, creepName);
					}
				}
			});
		});
	},
};

function getBody(bodyPartRatio: BodyPartConstant[], room: Room) {
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

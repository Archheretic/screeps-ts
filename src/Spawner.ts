// import { uuidv4 } from './utils';
// import { roomDefense } from 'roomDefense';
import RoomSettings from './RoomSettings';
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

					const roleSettings = roomSettings.roles[role];
					const creepMemory: CreepMemory = {
						role,
						roomOrigin: roomName,
						spawnOrigin: sp,
						room: roomName,
					};

					const creepSpawnedStatus = Game.spawns[sp].spawnCreep(
						getBody(roleSettings.bodyRatio, room),
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

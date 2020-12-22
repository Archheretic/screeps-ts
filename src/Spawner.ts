// import { uuidv4 } from './utils';
// import { roomDefense } from 'roomDefense';
import RoomSettings from './RoomSettings';
import { addSpawnedCreepToRoomMemory } from 'roomUtils';

const Spawner = {
	spawnAll(): void {
		const names = [
			'Randy',
			'Cartman',
			'Kyle',
			'Kenny',
			'Stan',
			'Butters',
			'Token',
			'Mr(s). Garrison',
			'Mr. Mackey',
			'Mr. Slave',
		];
		// const roomSpawnsMap = getRoomSpawnsMap();
		// const population = getPopulation();
		Object.keys(Game.rooms).forEach(roomName => {
			const roomSettings = RoomSettings[roomName];
			const room = Game.rooms[roomName];
			const spawnsInRoom = room.memory.spawns;
			const popInRoom = room.memory.spawned.roles;
			Object.keys(spawnsInRoom).forEach(sp => {
				// find first unused name, if no name is available give random number as name
				const creepName = !Memory.creeps
					? names[0]
					: names.find(n => !Memory.creeps[n]) || Math.random().toString(); // uuidv4();
				roomSettings.rolePriority.forEach(role => {
					// if there are less creeps spawned in the room then what is ideal spawn a new creep.
					if (popInRoom[role] < roomSettings.idealPopulation[role]) {
						const roleSettings = roomSettings.roles[role];
						const creepMemory: CreepMemory = {
							role,
							roomOrigin: roomName,
							spawnOrigin: sp,
							room: roomName,
						};

						const creepSpawnedStatus = Game.spawns[sp].spawnCreep(
							roleSettings.body,
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
		});
	},
};

export default Spawner;

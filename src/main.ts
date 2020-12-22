import { mapRoomsMemory, removeCreepFromRoomMemory } from './roomUtils';
import Creeps from './Creeps';
import { ErrorMapper } from 'utils/ErrorMapper';
import Spawner from './Spawner';
// import { roomDefense } from 'roomDefense';
// import { roomDefense, secure } from 'roomDefense';

// When compiling TS to JS and bundling with rollup, the line numbers and file names in error messages change
// This utility uses source maps to get the line numbers and file names of the original, TS source code
export const loop = ErrorMapper.wrapLoop(() => {
	console.log(`Current game tick is ${Game.time}`);
	// Automatically delete memory of missing creeps
	// if (!Memory.lastMappedRoomsMemory) {
	// mapRoomsMemory();
	// }
	for (const name in Memory.creeps) {
		if (!(name in Game.creeps)) {
			handleDeleteCreep(name);
		}
	}

	// {"name":"E32N56","energyAvailable":500,"energyCapacityAvailable":500,"visual":{"roomName":"E32N56"}}
	// console.log(JSON.stringify(Object.values(Game.rooms)[0]));
	// Object.values(Game.rooms).forEach(room=> {
	// })

	// secure();
	Spawner.spawnAll();
	Creeps.workWork();
});

function handleDeleteCreep(creepName: string): void {
	const creep = Game.creeps[creepName];
	console.log('creep', creep);
	console.log(
		'Memory.creeps[creepName]',
		JSON.stringify(Memory.creeps[creepName], null, 2)
	);
	removeCreepFromRoomMemory(creep.room.name, creepName);
	delete Memory.creeps[creepName];
}

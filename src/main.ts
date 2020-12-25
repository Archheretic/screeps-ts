import {
	mapRoomsMemory,
	periodicRoomChecks,
	removeCreepFromRoomMemory,
} from './roomUtils';
import Creeps from './Creeps';
import { ErrorMapper } from 'utils/ErrorMapper';
import Spawner from './Spawner';
import { secure } from 'roomDefense';

// When compiling TS to JS and bundling with rollup, the line numbers and file names in error messages change
// This utility uses source maps to get the line numbers and file names of the original, TS source code
export const loop = ErrorMapper.wrapLoop(() => {
	console.log(`Current game tick is ${Game.time}`);
	if (!Memory.lastMappedRoomsMemory) {
		mapRoomsMemory();
	}
	for (const name in Memory.creeps) {
		if (!(name in Game.creeps)) {
			// handle deletion of  missing creeps
			handleDeleteCreep(name);
		}
	}

	Object.values(Game.rooms).forEach((room, roomIndex) => {
		secure(room);
		periodicRoomChecks(room, roomIndex);
		Spawner.spawnAll(room);
	});
	// Change creep.workWork to take room as param? No cpu gain as of yet since a creep loop still needs to be ran.
	// but perhaps we can use a specific room state to impact creep work?
	Creeps.workWork();
});

function handleDeleteCreep(creepName: string): void {
	removeCreepFromRoomMemory(creepName);
	delete Memory.creeps[creepName];
}

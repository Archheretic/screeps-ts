import { findTargetAndBuild } from 'assignments/build';
import { harvestEnergy } from 'assignments/harvestEnergy';

const Builder = {
	work(creep: Creep): void {
		if (creep.memory.working && creep.store[RESOURCE_ENERGY] === 0) {
			creep.memory.working = false;
			creep.say('🔄 harvest');
		}
		if (!creep.memory.working && creep.store.getFreeCapacity() === 0) {
			creep.memory.working = true;
			creep.say('🚧 build');
		}

		if (creep.memory.working) {
			const targets = creep.room.find(FIND_CONSTRUCTION_SITES);
			if (targets.length) {
				findTargetAndBuild(creep, targets);
			}
			// else return resources.
		} else {
			harvestEnergy(creep);
		}
	},
};

export default Builder;

import { harvestEnergy } from 'assignments/harvestEnergy';
import { transferEnergyToTarget } from 'assignments/transferEnergy';

const Upgrader = {
	work(creep: Creep): void {
		if (creep.memory.working && creep.store[RESOURCE_ENERGY] === 0) {
			creep.memory.working = false;
			creep.say('🔄 harvest');
		}
		if (!creep.memory.working && creep.store.getFreeCapacity() === 0) {
			creep.memory.working = true;
			creep.say('⚡ upgrade');
		}

		if (creep.memory.working) {
			if (creep.room.controller) {
				transferEnergyToTarget(creep, creep.room.controller);
			}
		} else {
			harvestEnergy(creep);
		}
	},
};

export default Upgrader;

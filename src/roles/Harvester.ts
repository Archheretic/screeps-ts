import { harvestEnergy } from 'assignments/harvestEnergy';
import { transferEnergyToMyStructures } from 'assignments/transferEnergy';

const Harvester = {
	work(creep: Creep): void {
		const storeExcessResources = false;
		if (creep.memory.working && creep.store.getFreeCapacity() === 0) {
			creep.memory.working = false;
			creep.say('🏦 deposit');
		}
		if (!creep.memory.working && creep.store.getUsedCapacity() === 0) {
			creep.memory.working = true;
			creep.say('🔄 harvest');
		}

		if (creep.memory.working) {
			harvestEnergy(creep);
		} else {
			transferEnergyToMyStructures(creep, { storeExcessResources });
		}
	},
};

export default Harvester;

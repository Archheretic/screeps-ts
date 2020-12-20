import { findEnergySource } from './utils';

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
			if (
				creep.room.controller &&
				creep.upgradeController(creep.room.controller) === ERR_NOT_IN_RANGE
			) {
				creep.moveTo(creep.room.controller, {
					visualizePathStyle: { stroke: '#ffffff' },
				});
			}
		} else {
			const activeSource = findEnergySource(creep);
			if (activeSource) {
				if (creep.harvest(activeSource) === ERR_NOT_IN_RANGE) {
					creep.moveTo(activeSource, {
						visualizePathStyle: { stroke: '#ffaa00' },
					});
				}
			}
		}
	},
};

export default Upgrader;

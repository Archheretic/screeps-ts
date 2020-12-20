import { harvestEnergy } from './utils';

const Harvester = {
	work(creep: Creep): void {
		const storageExcessResources = false;
		if (creep.memory.working && creep.store.getFreeCapacity() === 0) {
			creep.memory.working = false;
			creep.say('deposit');
		}
		if (!creep.memory.working && creep.store.getUsedCapacity() === 0) {
			creep.memory.working = true;
			creep.say('🔄 harvest');
		}

		if (creep.memory.working) {
			harvestEnergy(creep);
		} else {
			const targets = creep.room.find(FIND_STRUCTURES, {
				filter: structure => {
					return (
						(structure.structureType === STRUCTURE_EXTENSION ||
							structure.structureType === STRUCTURE_SPAWN ||
							structure.structureType === STRUCTURE_TOWER) &&
						structure.energy < structure.energyCapacity
					);
				},
			});
			if (targets.length > 0) {
				if (creep.transfer(targets[0], RESOURCE_ENERGY) === ERR_NOT_IN_RANGE) {
					creep.moveTo(targets[0], {
						visualizePathStyle: { stroke: '#ffffff' },
					});
				}
			} else if (storageExcessResources) {
				const { name: roomName } = creep.room;
				const storage = Game.rooms[roomName].storage;
				if (storage) {
					if (creep.transfer(storage, RESOURCE_ENERGY) === ERR_NOT_IN_RANGE) {
						creep.moveTo(storage, {
							visualizePathStyle: { stroke: '#ffffff' },
						});
					}
				}
			} else {
				// this code will fail if there is no controller in the room
				if (
					creep.room.controller &&
					creep.upgradeController(creep.room.controller) === ERR_NOT_IN_RANGE
				) {
					creep.moveTo(creep.room.controller, {
						visualizePathStyle: { stroke: '#ffffff' },
					});
				}
			}
		}
	},
};

export default Harvester;

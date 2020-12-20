const Harvester = {
	work(creep: Creep): void {
		const storageExcessResources = false;
		if (creep.memory.working && creep.store.getUsedCapacity() === 0) {
			creep.memory.working = false;
			creep.say('harvesting');
		}
		if (!creep.memory.working && creep.store.getFreeCapacity() === 0) {
			creep.memory.working = true;
			creep.say('workinging');
		}

		if (!creep.memory.working) {
			// FIND_SOURCES is sources of resources?
			// const sources = creep.room.find(FIND_SOURCES);
			// const activeSource = sources[creep.memory.sourceIndex || 0];
			const activeSource = creep.pos.findClosestByRange(FIND_SOURCES);
			if (activeSource) {
				if (
					activeSource.energy === 0 &&
					activeSource.ticksToRegeneration > 5 &&
					!creep.store.getFreeCapacity()
				)
					creep.memory.working = true;
				if (creep.harvest(activeSource) === ERR_NOT_IN_RANGE) {
					creep.moveTo(activeSource, {
						visualizePathStyle: { stroke: '#ffaa00' },
					});
				}
			} else {
				// TODO: implement no available source
			}
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
				// this code doesnt work WHY?
				// Cannot read property 'storage' of undefined

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
					creep.moveTo(creep.room.controller);
				}
			}
		}
	},
};

export default Harvester;

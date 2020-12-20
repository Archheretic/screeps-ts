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
			console.log('targets:', JSON.stringify(targets, null, 2));
			if (targets.length) {
				if (creep.build(targets[0]) === ERR_NOT_IN_RANGE) {
					creep.moveTo(targets[0], {
						visualizePathStyle: { stroke: '#ffffff' },
					});
				}
			}
			// else return resources.
		} else {
			const sources = creep.room.find(FIND_SOURCES);
			if (creep.harvest(sources[0]) === ERR_NOT_IN_RANGE) {
				creep.moveTo(sources[0], { visualizePathStyle: { stroke: '#ffaa00' } });
			}
		}
	},
};

export default Builder;

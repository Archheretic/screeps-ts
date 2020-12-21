import { findEnergySource, isStoredEnergySourceViable } from 'creepUtils';

export function harvestEnergy(creep: Creep): void {
	let storedSource = creep.memory.sourceId
		? Game.getObjectById(creep.memory.sourceId)
		: null;

	if (!storedSource || !isStoredEnergySourceViable(creep)) {
		delete creep.memory.sourceId;
		storedSource = findEnergySource(creep);
	}
	if (storedSource) {
		if (creep.pos.isNearTo(storedSource)) {
			creep.harvest(storedSource);
		} else {
			creep.moveTo(storedSource, {
				visualizePathStyle: { stroke: '#ffaa00' },
			});
		}
	}
}

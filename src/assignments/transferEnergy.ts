import { findMyStructuresLackingEnergy } from 'creepUtils';

interface Optional {
	storeExcessResources?: boolean;
}

export function transferEnergyToMyStructures(
	creep: Creep,
	optional?: Optional
): void {
	const targets = findMyStructuresLackingEnergy(creep);
	if (targets.length) {
		findTargetAndTransferEnergy(creep, targets);
	} else if (optional?.storeExcessResources) {
		const { name: roomName } = creep.room;
		const storage = Game.rooms[roomName].storage;
		if (storage) {
			transferEnergyToTarget(creep, storage);
		}
	} else if (creep.room.controller) {
		transferEnergyToTarget(creep, creep.room.controller);
	}
}

export function findTargetAndTransferEnergy(
	creep: Creep,
	targets: AnyOwnedStructure[]
): void {
	// less costly, use this if you need cpu
	// const closestTarget = creep.pos.findClosestByRange(targets);
	// more costly
	const closestTarget = creep.pos.findClosestByPath(targets);
	if (closestTarget) {
		transferEnergyToTarget(creep, closestTarget);
	}
}

export function transferEnergyToTarget(
	creep: Creep,
	target: AnyOwnedStructure
): void {
	if (creep.pos.isNearTo(target)) {
		creep.transfer(target, RESOURCE_ENERGY);
	} else {
		if (creep.transfer(target, RESOURCE_ENERGY) === ERR_NOT_IN_RANGE) {
			creep.moveTo(target, {
				visualizePathStyle: { stroke: '#ffffff' },
			});
		}
	}
}

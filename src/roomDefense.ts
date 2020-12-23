export function secure(room: Room): void {
	roomDefense(room);
}

export function roomDefense(room: Room): void {
	const towers = room.find(FIND_MY_STRUCTURES, {
		filter: structure => structure.structureType === STRUCTURE_TOWER,
	}) as StructureTower[];

	if (towers.length) {
		towers.forEach(tower => {
			const closestDamagedStructure = tower.pos.findClosestByRange(
				FIND_STRUCTURES,
				{
					filter: structure => structure.hits < structure.hitsMax,
				}
			);
			if (closestDamagedStructure) {
				towerRepair(tower);
			}
			const closestHostile = tower.pos.findClosestByRange(FIND_HOSTILE_CREEPS);
			if (closestHostile) {
				tower.attack(closestHostile);
			}
		});
	}
}

/*
	Tower will first focus on repairing structures with less then 50% hits left
	It will then focus on repairing walls or ramparts with less then 300000 hits left.
*/
function towerRepair(tower: StructureTower) {
	const closestDamagedStructure = tower.pos.findClosestByRange(
		FIND_STRUCTURES,
		{
			filter: structure =>
				structure.hits < structure.hitsMax / 2 &&
				structure.structureType !== STRUCTURE_WALL &&
				structure.structureType !== STRUCTURE_RAMPART,
		}
	);
	if (closestDamagedStructure) {
		tower.repair(closestDamagedStructure);
	} else {
		const wallsAndRamparts = tower.room
			.find(FIND_STRUCTURES, {
				filter: structure =>
					(structure.structureType === STRUCTURE_WALL ||
						structure.structureType === STRUCTURE_RAMPART) &&
					structure.hits < 300000,
			})
			.sort((a, b) => a.hits - b.hits);

		if (wallsAndRamparts.length) {
			tower.repair(wallsAndRamparts[0]);
		}
	}
}

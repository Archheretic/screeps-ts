export function findEnergySource(creep: Creep): Source | null {
	if (creep.memory.sourceId) {
		return Game.getObjectById(creep.memory.sourceId);
	}
	const source = creep.pos.findClosestByRange(FIND_SOURCES);
	if (source) {
		creep.memory.sourceId = source.id;
	}
	return source;
}

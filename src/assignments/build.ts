export function findTargetAndBuild(
	creep: Creep,
	targets: ConstructionSite<BuildableStructureConstant>[]
): void {
	const closestTarget = creep.pos.findClosestByPath(targets);
	if (closestTarget) {
		buildTarget(creep, closestTarget);
	}
}

export function buildTarget(
	creep: Creep,
	target: ConstructionSite<BuildableStructureConstant>
): void {
	if (creep.pos.isNearTo(target)) {
		creep.build(target);
	} else {
		creep.moveTo(target, {
			visualizePathStyle: { stroke: '#ffffff' },
		});
	}
}

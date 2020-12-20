export function findEnergySource(creep: Creep): Source | null {
	// if creep already got a sourceId in memory we can save cpu by not performing loops
	if (creep.memory.sourceId) {
		return Game.getObjectById(creep.memory.sourceId);
	}

	const sources = creep.room.find(FIND_SOURCES);
	const source = sources.find(
		s => getOpenPositions(s.pos.x, s.pos.y, creep.room.name).length > 0
	);

	if (source) {
		creep.memory.sourceId = source.id;
	}
	return source || null;
}

export function getNearbyPositions(
	x: number,
	y: number,
	roomName: string
): RoomPosition[] {
	const positions: RoomPosition[] = [];

	// Don't want to use 0 since that can be room exit
	const startX = x - 1 || 1;
	const startY = y - 1 || 1;

	for (let xCoord = startX; xCoord < x && xCoord < 49; xCoord++) {
		for (let yCoord = startY; yCoord < y && yCoord < 49; yCoord++) {
			if (xCoord !== x || yCoord !== y) {
				positions.push(new RoomPosition(xCoord, yCoord, roomName));
			}
		}
	}
	return positions;
}

export function getOpenPositions(
	x: number,
	y: number,
	roomName: string
): RoomPosition[] {
	const nearbyPositions = getNearbyPositions(x, y, roomName);
	const terrain = Game.map.getRoomTerrain(roomName);

	const walkablePositions = nearbyPositions.filter(
		pos => terrain.get(pos.x, pos.y) !== TERRAIN_MASK_WALL
	);

	const freePositions = walkablePositions.filter(
		pos => !pos.lookFor(LOOK_CREEPS).length
	);

	return freePositions;
}

export function harvestEnergy(creep: Creep): void {
	const storedSource = creep.memory.sourceId
		? Game.getObjectById(creep.memory.sourceId)
		: null;

	if (
		storedSource &&
		// storedSource needs to have energy or get energy in 5 ticks
		(storedSource.energy !== 0 || storedSource.ticksToRegeneration > 5) &&
		// and storedSource needs to have openPositions or be adjacent to creep
		(getOpenPositions(storedSource.pos.x, storedSource.pos.y, creep.room.name)
			.length ||
			creep.pos.isNearTo(storedSource))
	) {
		if (creep.harvest(storedSource) === ERR_NOT_IN_RANGE) {
			creep.moveTo(storedSource, {
				visualizePathStyle: { stroke: '#ffaa00' },
			});
		}
	} else {
		findEnergySource(creep);
	}
}

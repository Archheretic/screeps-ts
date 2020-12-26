export function addBlockerToFlag(creepMemory: CreepMemory): void {
	const { targetRoom } = creepMemory;
	const room = Game.rooms[targetRoom];
	const blockFlag = room.find(FIND_FLAGS).find(flag => {
		if (flag.name.includes('block')) {
			if (
				!flag.memory.blocker ||
				Game.time - flag.memory.blocker?.lastSpawn >= CREEP_LIFE_TIME
			) {
				return true;
			}
		}
		return false;
	});
	if (blockFlag) {
		blockFlag.memory.blocker = {
			...blockFlag.memory.blocker,
			lastSpawn: Game.time,
		};
		creepMemory.targetFlag = blockFlag.name;
	}
}

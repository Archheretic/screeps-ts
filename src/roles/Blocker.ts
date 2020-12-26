const Blocker = {
	work(creep: Creep): void {
		if (creep.memory.targetFlag) {
			const targetFlag = Game.flags[creep.memory.targetFlag];
			if (!creep.pos.isEqualTo(targetFlag)) {
				creep.moveTo(targetFlag.pos, {
					visualizePathStyle: { stroke: 'coral' },
				});
			}
			// else {
			// stand and block!
			// }
		}
	},
};

export default Blocker;

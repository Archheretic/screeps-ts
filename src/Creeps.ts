import Builder from './roles/Builder';
import Harvester from './roles/Harvester';
import Upgrader from './roles/Upgrader';

const Creeps = {
	workWork(): void {
		const { creeps } = Game;
		Object.keys(creeps).forEach(creepName => {
			const creep = creeps[creepName];
			switch (creep.memory.role) {
				case 'harvester': {
					Harvester.work(creep);
					break;
				}
				case 'miner': {
					Harvester.work(creep);
					break;
				}
				case 'builder': {
					Builder.work(creep);
					break;
				}
				case 'upgrader': {
					Upgrader.work(creep);
					break;
				}
			}
		});
	},
};

export default Creeps;

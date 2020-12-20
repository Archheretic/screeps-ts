import Harvester from './roles/Harvester';
import Builder from './roles/Builder';
import Upgrader from './roles/Upgrader';

const Creeps = {
	workWork() {
		const { creeps } = Game;
		Object.keys(creeps).forEach(creepName => {
			const creep = creeps[creepName];
			switch(creep.memory.role) {
				case 'harvester': {
					Harvester.work(creep);
				}
				case 'builder': {
					Builder.work(creep);
				}
				case 'upgrader': {
					Upgrader.work(creep);
				}
			}
		});
	}
};

export default Creeps;

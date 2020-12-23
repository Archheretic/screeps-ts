const ROLES_TYPES = ['harvester', 'builder', 'upgrader'];

type roles = typeof ROLES_TYPES[number];

interface RoomSettingsType {
	[roomName: string]: {
		idealPopulation: {
			[role: string]: number;
		};
		roles: {
			[role: string]: {
				bodyRatio: BodyPartConstant[];
			};
		};
		rolePriority: roles[];
	};
}

const RoomSettings: RoomSettingsType = {
	/**
	 * First room
	 */
	E32N56: {
		idealPopulation: { harvester: 3, builder: 2, upgrader: 1 },
		roles: {
			harvester: {
				bodyRatio: [WORK, CARRY, MOVE],
			},
			builder: {
				bodyRatio: [WORK, CARRY, MOVE],
			},
			upgrader: {
				bodyRatio: [WORK, CARRY, MOVE, MOVE],
			},
		},
		rolePriority: ['harvester', 'builder', 'upgrader'],
	},
};

export default RoomSettings;

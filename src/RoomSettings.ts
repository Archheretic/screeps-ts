const ROLES_TYPES = ['harvester', 'builder', 'upgrader'];

type roles = typeof ROLES_TYPES[number];

interface RoomSettingsType {
	[roomName: string]: {
		idealPopulation: {
			[role: string]: number;
		};
		roles: {
			[role: string]: {
				body: BodyPartConstant[];
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
		idealPopulation: { harvester: 2, builder: 3, upgrader: 3 },
		roles: {
			harvester: {
				body: [WORK, WORK, CARRY, CARRY, MOVE, MOVE],
			},
			builder: {
				body: [WORK, WORK, CARRY, CARRY, MOVE, MOVE],
			},
			upgrader: {
				body: [WORK, WORK, CARRY, CARRY, MOVE, MOVE, MOVE],
			},
		},
		rolePriority: ['harvester', 'builder', 'upgrader'],
	},
};

export default RoomSettings;

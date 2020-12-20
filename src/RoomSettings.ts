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
		idealPopulation: { harvester: 3, builder: 0, upgrader: 2 },
		roles: {
			harvester: {
				body: [WORK, WORK, CARRY, MOVE, MOVE],
			},
			builder: {
				body: [WORK, CARRY, MOVE, MOVE],
			},
			upgrader: {
				body: [WORK, CARRY, CARRY, MOVE, MOVE, MOVE],
			},
		},
		rolePriority: ['harvester', 'builder', 'upgrader'],
	},
};

export default RoomSettings;

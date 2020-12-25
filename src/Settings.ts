const ROLES_TYPES = ['harvester', 'builder', 'upgrader'];

type roles = typeof ROLES_TYPES[number];

interface SettingsType {
	rooms: RoomSettingsType;
	roles: {
		// possible to override roles bodyPartRatio on a specific room
		[role: string]: {
			bodyPartRatio: BodyPartConstant[];
		};
	};
}
interface RoomSettingsType {
	[roomName: string]: {
		idealPopulation: {
			[role: string]: number;
		};
		roles?: {
			[role: string]: {
				bodyPartRatio: BodyPartConstant[];
			};
		};
		rolePriority: roles[];
	};
}

export const RoomSettings: RoomSettingsType = {
	/**
	 * First room
	 */
	E32N56: {
		idealPopulation: { harvester: 2, builder: 4, upgrader: 1 },
		// overrides global setings body part ratio settings
		roles: {
			harvester: {
				bodyPartRatio: [WORK, CARRY, MOVE],
			},
			builder: {
				bodyPartRatio: [WORK, CARRY, MOVE],
			},
			upgrader: {
				bodyPartRatio: [WORK, CARRY, MOVE, MOVE],
			},
		},
		rolePriority: ['harvester', 'builder', 'upgrader'],
	},
};

export const Settings: SettingsType = {
	rooms: RoomSettings,
	roles: {
		// possible to override roles bodyPartRatio on a specific room
		harvester: {
			bodyPartRatio: [WORK, CARRY, MOVE],
		},
		builder: {
			bodyPartRatio: [WORK, CARRY, MOVE],
		},
		upgrader: {
			bodyPartRatio: [WORK, CARRY, MOVE, MOVE],
		},
	},
};

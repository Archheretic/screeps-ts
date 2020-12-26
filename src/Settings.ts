// const ROLES_TYPES = ['harvester', 'builder', 'upgrader', 'miner', 'blocker'];
// typeof ROLES_TYPES[number];
export type FlagType = 'block';

export type RolesType =
	| 'harvester'
	| 'builder'
	| 'upgrader'
	| 'miner'
	| 'blocker';

interface SettingsType {
	rooms: RoomsSettingsType;
	roles: {
		// possible to override roles bodyPartRatio on a specific room
		[role: string]: {
			bodyPartRatio: BodyPartConstant[];
		};
	};
}
export interface RolesNumbersType {
	[role: string]: number;
}
export interface RoomSettingsType {
	idealPopulation: {
		[role: string]: number;
	};
	roles?: {
		[role: string]: {
			bodyPartRatio: BodyPartConstant[];
		};
	};
	rolePriority: RolesType[];
}
interface RoomsSettingsType {
	[roomName: string]: RoomSettingsType;
}

export const RoomsSettings: RoomsSettingsType = {
	/**
	 * First room
	 */
	E32N56: {
		idealPopulation: { blocker: 4, harvester: 0, builder: 4, upgrader: 1 },
		// overrides global setings body part ratio settings
		roles: {
			blocker: {
				bodyPartRatio: [WORK],
			},
			miner: {
				bodyPartRatio: [WORK, CARRY, MOVE],
			},
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
		rolePriority: ['miner', 'harvester', 'builder', 'upgrader', 'blocker'],
	},
};

export const Settings: SettingsType = {
	rooms: RoomsSettings,
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

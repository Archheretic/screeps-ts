const ROLES_TYPES = ['harvester' , 'builder' , 'upgrader']

type roles = typeof ROLES_TYPES[number];

type RoomSettingsType = {
	[roomName: string]: {
		idealPopulation: {
			[role: string]: number;
		},
		roles: {
			[role: string]: {
				body: BodyPartConstant[];
			}
		},
		rolePriority: roles[];
	}
}

const RoomSettings: RoomSettingsType = {
	/**
	 * First room
	 */
	E32N56 :
	{
			idealPopulation : {'harvester': 2, 'builder': 2, 'upgrader': 0	},
			roles: {
				harvester: {
					body: [WORK, CARRY, MOVE, MOVE]
				},
				builder: {
					body: [WORK, CARRY, MOVE, MOVE]
				},
				upgrader: {
					body: [WORK, CARRY, MOVE, MOVE]
				}
			},
			rolePriority: ['harvester', 'builder', 'upgrader'],
	}
};

export default RoomSettings;

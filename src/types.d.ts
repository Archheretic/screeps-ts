// example declaration file - remove these and add your own custom typings

// memory extension samples
interface CreepMemory {
	role: string;
	roomOrigin: string;
	spawnOrigin: string;
	working?: boolean;
	sourceIndex?: number;
}

interface Memory {
	uuid: number;
	log: any;
}

// `global` extension samples
declare namespace NodeJS {
	interface Global {
		log: any;
	}
}

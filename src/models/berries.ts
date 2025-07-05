export interface Berry {
  id: string;
  name: string;
  growthTime: number; // Hours it takes to grow starting from when they are planted.
  minYield: number;
  maxYield: number;
}

export class FarmPlot {
  id: string;
  berryId: string;
  plantedPlotsCount: number;
  waterStatus: number; // Ranges from 0 to 5, with 5 being fully watered, 0 is fully dry. 5 bars of water last 12 hours.
  expectedMinYield: number;
  expectedMaxYield: number;
  plantedTime: Date;
  lastWateredTime: Date; 

	constructor(id: string, berryId: string, plotCount: number, plantedTime: Date) {
		this.id = id;
		this.berryId = berryId;
		this.waterStatus = 5;
		this.plantedPlotsCount = plotCount;
		this.expectedMinYield = plotCount * berries[berryId].minYield;
		this.expectedMaxYield = plotCount * berries[berryId].maxYield;
		this.plantedTime = plantedTime;
		this.lastWateredTime = plantedTime; // Berry plots get watered immediately when planted.
	}

	water() {
		// If waterStatus is 5 when a plot gets watered, 
		// 1 is removed from the expected min and max yields per planted plot due to overwatering.
		// Otherwise, waterStatus gets set to 5.

		if (this.waterStatus == 5) {
			this.expectedMinYield -= this.plantedPlotsCount
			this.expectedMaxYield -= this.plantedPlotsCount
		}

		this.lastWateredTime = new Date();
		this.waterStatus = 5;
	}

}

export const berries: Record<string, Berry> = {
  leppa: {
    id: "leppa",
    name: "Leppa Berry",
    growthTime: 20,
	minYield: 5,
  	maxYield: 7,
  },
  rawst: {
    id: "rawst",
    name: "Rawst Berry",
    growthTime: 16,
	minYield: 3,
  	maxYield: 6,
  },
  cheri: {
    id: "cheri",
    name: "Cheri Berry",
    growthTime: 16,
	minYield: 3,
  	maxYield: 6,
  },
  pecha: {
    id: "pecha",
    name: "Pecha Berry",
    growthTime: 16,
	minYield: 3,
  	maxYield: 6,
  },
};
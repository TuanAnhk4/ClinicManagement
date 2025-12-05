export interface Specialty {
  id: number;
  name: string;
  description: string;
  baseCost: number;
}

export interface CreateSpecialtyPayload {
  name: string;
  description?: string;
  base_cost: number;
}

export interface UpdateSpecialtyPayload {
  name?: string;
  description?: string;
  base_cost?: number;
}

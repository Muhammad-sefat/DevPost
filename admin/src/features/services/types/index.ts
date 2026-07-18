export interface Service {
  id: string;
  name: string;
  description: string;
  status: "active" | "inactive" | "maintenance";
  createdAt: string;
  updatedAt: string;
}

export interface CreateServiceInput {
  name: string;
  description: string;
}

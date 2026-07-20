import { Role } from "@prisma/client";

export interface RequestUser {
    userId: string;
    role: Role;
}

declare global {
    namespace Express {
        interface Request {
            user?: RequestUser;
        }
    }
}
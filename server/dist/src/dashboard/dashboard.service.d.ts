import { PrismaService } from "../prisma/prisma.service";
import { CreateDashboardDto } from "./dto/create-dashboard.dto";
import { CreateRangeDto } from "./dto/create-range.dto";
export declare class DashboardService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    create(ownerId: string, dto: CreateDashboardDto): Promise<{
        members: {
            userId: string;
            joinedAt: Date;
            dashboardId: string;
        }[];
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        ownerId: string;
    }>;
    addMember(ownerId: string, dashboardId: string, userId: string): Promise<{
        userId: string;
        joinedAt: Date;
        dashboardId: string;
    }>;
    addRange(ownerId: string, dashboardId: string, dto: CreateRangeDto): Promise<{
        id: string;
        createdAt: Date;
        from: Date;
        to: Date;
        dashboardId: string;
    }>;
    get(userId: string, dashboardId: string): Promise<{
        members: ({
            user: {
                id: string;
                email: string;
                passwordHash: string;
                roles: import(".prisma/client").$Enums.Role[];
                createdAt: Date;
                updatedAt: Date;
            };
        } & {
            userId: string;
            joinedAt: Date;
            dashboardId: string;
        })[];
        owner: {
            id: string;
            email: string;
            passwordHash: string;
            roles: import(".prisma/client").$Enums.Role[];
            createdAt: Date;
            updatedAt: Date;
        };
        ranges: {
            id: string;
            createdAt: Date;
            from: Date;
            to: Date;
            dashboardId: string;
        }[];
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        ownerId: string;
    }>;
    delete(ownerId: string, dashboardId: string): Promise<{
        message: string;
    }>;
    removeMember(ownerId: string, dashboardId: string, userId: string): Promise<{
        message: string;
    }>;
    removeRange(ownerId: string, dashboardId: string, rangeId: string): Promise<{
        message: string;
    }>;
    private ensureNoOverlap;
}

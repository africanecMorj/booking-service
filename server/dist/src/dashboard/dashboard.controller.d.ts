import { AccessTokenPayload } from '../auth/types/access-token.payload';
import { DashboardService } from './dashboard.service';
import { CreateDashboardDto } from './dto/create-dashboard.dto';
import { AddMemberDto } from './dto/add-member.dto';
import { CreateRangeDto } from './dto/create-range.dto';
export declare class DashboardController {
    private readonly dashboard;
    constructor(dashboard: DashboardService);
    create(user: AccessTokenPayload, dto: CreateDashboardDto): Promise<{
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
    addMember(user: AccessTokenPayload, id: string, dto: AddMemberDto): Promise<{
        userId: string;
        joinedAt: Date;
        dashboardId: string;
    }>;
    addRange(user: AccessTokenPayload, id: string, dto: CreateRangeDto): Promise<{
        id: string;
        createdAt: Date;
        from: Date;
        to: Date;
        dashboardId: string;
    }>;
    get(user: AccessTokenPayload, id: string): Promise<{
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
    delete(user: AccessTokenPayload, id: string): Promise<{
        message: string;
    }>;
    removeMember(user: AccessTokenPayload, id: string, userId: string): Promise<{
        message: string;
    }>;
    removeRange(user: AccessTokenPayload, id: string, rangeId: string): Promise<{
        message: string;
    }>;
}

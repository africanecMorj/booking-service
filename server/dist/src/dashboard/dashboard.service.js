"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DashboardService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let DashboardService = class DashboardService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async create(ownerId, dto) {
        return this.prisma.dashboard.create({
            data: {
                ownerId,
                members: {
                    create: dto.members?.map((id) => ({
                        userId: id,
                    })) ?? [],
                },
            },
            include: {
                members: true,
            },
        });
    }
    async addMember(ownerId, dashboardId, userId) {
        const dashboard = await this.prisma.dashboard.findUnique({
            where: {
                id: dashboardId,
            },
        });
        if (!dashboard) {
            throw new common_1.NotFoundException();
        }
        if (dashboard.ownerId !== ownerId) {
            throw new common_1.ForbiddenException();
        }
        return this.prisma.dashboardMember.create({
            data: {
                dashboardId,
                userId,
            },
        });
    }
    async addRange(ownerId, dashboardId, dto) {
        const from = new Date(dto.from);
        const to = new Date(dto.to);
        return this.prisma.$transaction(async (tx) => {
            const dashboard = await tx.dashboard.findUnique({
                where: {
                    id: dashboardId,
                },
            });
            if (!dashboard) {
                throw new common_1.NotFoundException();
            }
            if (dashboard.ownerId !== ownerId) {
                throw new common_1.ForbiddenException();
            }
            const overlap = await tx.dashboardRange.findFirst({
                where: {
                    dashboardId,
                    AND: [
                        {
                            from: {
                                lte: to,
                            },
                        },
                        {
                            to: {
                                gte: from,
                            },
                        },
                    ],
                },
            });
            if (overlap) {
                throw new common_1.ConflictException('Range overlaps with an existing range.');
            }
            return tx.dashboardRange.create({
                data: {
                    dashboardId,
                    from,
                    to,
                },
            });
        });
    }
    async get(userId, dashboardId) {
        const dashboard = await this.prisma.dashboard.findFirst({
            where: {
                id: dashboardId,
                OR: [
                    {
                        ownerId: userId,
                    },
                    {
                        members: {
                            some: {
                                userId,
                            },
                        },
                    },
                ],
            },
            include: {
                owner: true,
                members: {
                    include: {
                        user: true,
                    },
                },
                ranges: true,
            },
        });
        if (!dashboard) {
            throw new common_1.NotFoundException();
        }
        return dashboard;
    }
    async delete(ownerId, dashboardId) {
        const dashboard = await this.prisma.dashboard.findUnique({
            where: {
                id: dashboardId,
            },
        });
        if (!dashboard) {
            throw new common_1.NotFoundException();
        }
        if (dashboard.ownerId !== ownerId) {
            throw new common_1.ForbiddenException();
        }
        await this.prisma.dashboard.delete({
            where: {
                id: dashboardId,
            },
        });
        return {
            message: 'Dashboard deleted successfully',
        };
    }
    async removeMember(ownerId, dashboardId, userId) {
        const dashboard = await this.prisma.dashboard.findUnique({
            where: {
                id: dashboardId,
            },
        });
        if (!dashboard) {
            throw new common_1.NotFoundException();
        }
        if (dashboard.ownerId !== ownerId) {
            throw new common_1.ForbiddenException();
        }
        await this.prisma.dashboardMember.delete({
            where: {
                dashboardId_userId: {
                    dashboardId,
                    userId,
                },
            },
        });
        return {
            message: 'Member removed successfully',
        };
    }
    async removeRange(ownerId, dashboardId, rangeId) {
        const dashboard = await this.prisma.dashboard.findUnique({
            where: {
                id: dashboardId,
            },
        });
        if (!dashboard) {
            throw new common_1.NotFoundException();
        }
        if (dashboard.ownerId !== ownerId) {
            throw new common_1.ForbiddenException();
        }
        const range = await this.prisma.dashboardRange.findFirst({
            where: {
                id: rangeId,
                dashboardId,
            },
        });
        if (!range) {
            throw new common_1.NotFoundException();
        }
        await this.prisma.dashboardRange.delete({
            where: {
                id: rangeId,
            },
        });
        return {
            message: 'Range removed successfully',
        };
    }
    async ensureNoOverlap(dashboardId, from, to) {
        const overlap = await this.prisma.dashboardRange.findFirst({
            where: {
                dashboardId,
                AND: [
                    {
                        from: {
                            lte: to,
                        },
                    },
                    {
                        to: {
                            gte: from,
                        },
                    },
                ],
            },
        });
        if (overlap) {
            throw new common_1.ConflictException('Range overlaps with an existing range.');
        }
    }
};
exports.DashboardService = DashboardService;
exports.DashboardService = DashboardService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], DashboardService);
//# sourceMappingURL=dashboard.service.js.map
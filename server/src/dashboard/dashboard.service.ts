import {
  ForbiddenException,
  Injectable,
  NotFoundException,
  ConflictException,
} from "@nestjs/common";

import { PrismaService } from "../prisma/prisma.service";

import { CreateDashboardDto } from "./dto/create-dashboard.dto";
import { CreateRangeDto } from "./dto/create-range.dto";

@Injectable()
export class DashboardService {
  constructor(
    private readonly prisma: PrismaService,
  ) {}

  async create(
    ownerId: string,
    dto: CreateDashboardDto,
  ) {
    return this.prisma.dashboard.create({
      data: {
        ownerId,

        members: {
          create:
            dto.members?.map((id) => ({
              userId: id,
            })) ?? [],
        },
      },
      include: {
        members: true,
      },
    });
  }

  async addMember(
    ownerId: string,
    dashboardId: string,
    userId: string,
  ) {
    const dashboard =
      await this.prisma.dashboard.findUnique({
        where: {
          id: dashboardId,
        },
      });

    if (!dashboard) {
      throw new NotFoundException();
    }

    if (dashboard.ownerId !== ownerId) {
      throw new ForbiddenException();
    }

    return this.prisma.dashboardMember.create({
      data: {
        dashboardId,
        userId,
      },
    });
  }

  async addRange(
    ownerId: string,
    dashboardId: string,
    dto: CreateRangeDto,
  ) {
    const from = new Date(dto.from);
    const to = new Date(dto.to);

    return this.prisma.$transaction(async (tx) => {
      const dashboard =
        await tx.dashboard.findUnique({
          where: {
            id: dashboardId,
          },
        });

      if (!dashboard) {
        throw new NotFoundException();
      }

      if (dashboard.ownerId !== ownerId) {
        throw new ForbiddenException();
      }

      const overlap =
        await tx.dashboardRange.findFirst({
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
        throw new ConflictException(
          'Range overlaps with an existing range.',
        );
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

  async get(
    userId: string,
    dashboardId: string,
  ) {
    const dashboard =
      await this.prisma.dashboard.findFirst({
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
      throw new NotFoundException();
    }

    return dashboard;
  }

  async delete(
    ownerId: string,
    dashboardId: string,
  ) {
    const dashboard =
      await this.prisma.dashboard.findUnique({
        where: {
          id: dashboardId,
        },
      });

    if (!dashboard) {
      throw new NotFoundException();
    }

    if (dashboard.ownerId !== ownerId) {
      throw new ForbiddenException();
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

  async removeMember(
    ownerId: string,
    dashboardId: string,
    userId: string,
  ) {
    const dashboard =
      await this.prisma.dashboard.findUnique({
        where: {
          id: dashboardId,
        },
      });

    if (!dashboard) {
      throw new NotFoundException();
    }

    if (dashboard.ownerId !== ownerId) {
      throw new ForbiddenException();
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

  async removeRange(
    ownerId: string,
    dashboardId: string,
    rangeId: string,
  ) {
    const dashboard =
      await this.prisma.dashboard.findUnique({
        where: {
          id: dashboardId,
        },
      });

    if (!dashboard) {
      throw new NotFoundException();
    }

    if (dashboard.ownerId !== ownerId) {
      throw new ForbiddenException();
    }

    const range =
      await this.prisma.dashboardRange.findFirst({
        where: {
          id: rangeId,
          dashboardId,
        },
      });

    if (!range) {
      throw new NotFoundException();
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

  private async ensureNoOverlap(
    dashboardId: string,
    from: Date,
    to: Date,
  ) {
    const overlap =
      await this.prisma.dashboardRange.findFirst({
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
      throw new ConflictException(
        'Range overlaps with an existing range.',
      );
    }
  }
}


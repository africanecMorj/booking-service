import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  UseGuards,
  Delete,
} from '@nestjs/common';

import { JwtAuthGuard } from '../auth/guards/jwtAuth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { AccessTokenPayload } from '../auth/types/access-token.payload';

import { DashboardService } from './dashboard.service';

import { CreateDashboardDto } from './dto/create-dashboard.dto';
import { AddMemberDto } from './dto/add-member.dto';
import { CreateRangeDto } from './dto/create-range.dto';

@Controller("dashboards")
@UseGuards(JwtAuthGuard)
export class DashboardController {
  constructor(
    private readonly dashboard: DashboardService,
  ) {}

  @Post()
  create(
    @CurrentUser() user: AccessTokenPayload,
    @Body() dto: CreateDashboardDto,
  ) {
    return this.dashboard.create(user.sub, dto);
  }

  @Post(":id/members")
  addMember(
    @CurrentUser() user: AccessTokenPayload,
    @Param("id") id: string,
    @Body() dto: AddMemberDto,
  ) {
    return this.dashboard.addMember(
      user.sub,
      id,
      dto.userId,
    );
  }

  @Post(":id/ranges")
  addRange(
    @CurrentUser() user: AccessTokenPayload,
    @Param("id") id: string,
    @Body() dto: CreateRangeDto,
  ) {
    return this.dashboard.addRange(
      user.sub,
      id,
      dto,
    );
  }

  @Get(":id")
  get(
    @CurrentUser() user: AccessTokenPayload,
    @Param("id") id: string,
  ) {
    return this.dashboard.get(user.sub, id);
  }

  @Delete(':id')
  delete(
    @CurrentUser() user: AccessTokenPayload,
    @Param('id') id: string,
  ) {
    return this.dashboard.delete(user.sub, id);
  }

  @Delete(':id/members/:userId')
  removeMember(
    @CurrentUser() user: AccessTokenPayload,
    @Param('id') id: string,
    @Param('userId') userId: string,
  ) {
    return this.dashboard.removeMember(
      user.sub,
      id,
      userId,
    );
  }

  @Delete(':id/ranges/:rangeId')
  removeRange(
    @CurrentUser() user: AccessTokenPayload,
    @Param('id') id: string,
    @Param('rangeId') rangeId: string,
  ) {
    return this.dashboard.removeRange(
      user.sub,
      id,
      rangeId,
    );
  }
}
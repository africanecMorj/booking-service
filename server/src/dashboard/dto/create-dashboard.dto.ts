import {
  IsArray,
  IsOptional,
  IsUUID,
} from "class-validator";

export class CreateDashboardDto {
  @IsOptional()
  @IsArray()
  @IsUUID("4", {
    each: true,
  })
  members?: string[];
}
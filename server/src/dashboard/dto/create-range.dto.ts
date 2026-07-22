import {
  IsDateString,
} from "class-validator";

export class CreateRangeDto {
  @IsDateString()
  from: string;

  @IsDateString()
  to: string;
}
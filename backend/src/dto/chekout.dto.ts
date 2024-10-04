import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class ChekoutDto {
  @IsNotEmpty()
  @IsString()
  userId: string;

  @IsNotEmpty()
  @IsString()
  @IsOptional()
  discountCode: string;
}

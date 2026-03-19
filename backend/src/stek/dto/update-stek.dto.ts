import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsNotEmpty, IsNumber, IsOptional, IsString, ValidateNested } from 'class-validator';

class UpdateScheduleDto {
	@IsNumber()
	@IsOptional()
	@IsNotEmpty()
	@ApiPropertyOptional()
	day?: number;

	@IsString()
	@IsOptional()
	@IsNotEmpty()
	@ApiPropertyOptional()
	hour?: string;

	@IsString()
	@IsOptional()
	@IsNotEmpty()
	@ApiPropertyOptional()
	minute?: string;
}

export class UpdateStekDto {
	@IsString()
	@IsOptional()
	@IsNotEmpty()
	@ApiPropertyOptional()
	salon?: string;

	@IsNumber()
	@IsOptional()
	@IsNotEmpty()
	@ApiPropertyOptional()
	price?: number;

	@ValidateNested()
	@IsOptional()
	@Type(() => UpdateScheduleDto)
	@ApiPropertyOptional({ type: UpdateScheduleDto })
	schedule?: UpdateScheduleDto;
}

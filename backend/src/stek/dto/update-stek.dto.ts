import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsNotEmpty, IsNumber, IsOptional, IsString, ValidateNested } from 'class-validator';

class UpdateSchedulesDto {
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

	@IsString()
	@IsOptional()
	@ApiPropertyOptional()
	user?: string;

	@IsString()
	@IsOptional()
	@ApiPropertyOptional()
	status?: string;

	@ValidateNested()
	@IsOptional()
	@Type(() => UpdateSchedulesDto)
	@ApiPropertyOptional({ type: UpdateSchedulesDto })
	schedules?: UpdateSchedulesDto;
}

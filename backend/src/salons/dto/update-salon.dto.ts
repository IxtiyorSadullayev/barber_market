import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsArray, IsNumber, IsObject, IsOptional, IsString } from 'class-validator';

export class UpdateSalonDto {
	@IsString()
	@IsOptional()
	@ApiPropertyOptional()
	name?: string;

	@IsNumber()
	@IsOptional()
	@ApiPropertyOptional()
	rating?: number;

	@IsObject()
	@IsOptional()
	@ApiPropertyOptional()
	map?: { lat: number; long: number };

	@IsArray()
	@IsOptional()
	@ApiPropertyOptional({ type: [String] })
	phones?: string[];

	@IsString()
	@IsOptional()
	@ApiPropertyOptional()
	address?: string;

	@IsArray()
	@IsOptional()
	@ApiPropertyOptional({ type: [String] })
	images?: string[];

	@IsString()
	@IsOptional()
	@ApiPropertyOptional()
	owner?: string;

	@IsArray()
	@IsOptional()
	@ApiPropertyOptional({ type: [String] })
	employees?: string[];

	@IsObject()
	@IsOptional()
	@ApiPropertyOptional()
	schedules?: { days: number[]; from: string; to: string };
}


import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsNotEmpty, IsNumber, IsOptional, IsString, ValidateNested } from "class-validator";

class SchedulesDto {
    @IsNumber()
    @IsNotEmpty()
    @ApiProperty()
    day: number;

    @IsString()
    @IsNotEmpty()
    @ApiProperty()
    hour: string;

    @IsString()
    @IsNotEmpty()
    @ApiProperty()
    minute: string;
}

export class CreateStekDto {
    @IsString()
    @IsNotEmpty()
    @ApiProperty()
    salon: string;

    @IsString()
    @IsNotEmpty()
    @ApiProperty()
    user: string;

    @IsString()
    @IsOptional()
    @ApiProperty()
    status: string;

    @ValidateNested()
    @Type(() => SchedulesDto)
    @ApiProperty({ type: SchedulesDto })
    schedules: SchedulesDto;
}
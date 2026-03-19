import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsNotEmpty, IsNumber, IsString, ValidateNested } from "class-validator";

class ScheduleDto {
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

    @IsNumber()
    @IsNotEmpty()
    @ApiProperty()
    price: number;

    @ValidateNested()
    @Type(() => ScheduleDto)
    @ApiProperty({ type: ScheduleDto })
    schedule: ScheduleDto;
}
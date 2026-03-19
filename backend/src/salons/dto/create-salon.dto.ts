import { ApiProperty } from "@nestjs/swagger";
import { IsArray, IsNotEmpty, IsNumber, IsObject, IsOptional, IsString } from "class-validator";

export class CreateSalonDto {
    @IsString()
    @IsNotEmpty()
    @ApiProperty()
    name: string

    @IsNumber()
    @IsOptional()
    @ApiProperty()
    rating?: number;

    @IsObject()
    @IsNotEmpty()
    @ApiProperty()
    map: { lat: number; long: number; }

    @IsArray()
    @IsNotEmpty()
    @ApiProperty()
    phones: string[];

    @IsString()
    @IsNotEmpty()
    @ApiProperty()
    address: string

    @IsArray()
    @IsOptional()
    @ApiProperty()
    images?: string[];

    @IsString()
    @IsNotEmpty()
    @ApiProperty()
    owner: string;

    @IsArray()
    @IsOptional()
    @ApiProperty()
    employees?: string[];

    @IsObject()
    @IsNotEmpty()
    @ApiProperty()
    scheludes: { days: number[]; from: string; to: string };
}

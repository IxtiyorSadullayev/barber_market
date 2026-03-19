import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { IsNotEmpty, IsOptional, IsString } from "class-validator";

export class CreateUserDto {
    @IsString()
    @IsNotEmpty()
    @ApiProperty()
    firstname: string;

    @IsString()
    @IsNotEmpty()
    @ApiProperty()
    lastname: string;

    @IsString()
    @IsOptional()
    @ApiPropertyOptional()
    email?: string;

    @IsString()
    @IsOptional()
    @ApiPropertyOptional()
    phonenumber?: string;

    @IsString()
    @IsNotEmpty()
    @ApiProperty()
    password: string;

    @IsString()
    @IsNotEmpty()
    @ApiProperty()
    gender: string;
}

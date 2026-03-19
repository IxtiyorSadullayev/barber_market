import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { IsNotEmpty, IsOptional, IsString } from "class-validator";

export class LoginUserDto {
    @IsString()
    @IsOptional()
    @ApiPropertyOptional()
    phonenumber?: string;

    @IsString()
    @IsOptional()
    @ApiPropertyOptional()
    email?: string;

    @IsString()
    @IsNotEmpty()
    @ApiProperty()
    password: string;
}

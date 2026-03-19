import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { IsEmail, IsOptional, IsPhoneNumber, IsString } from "class-validator";

export class ForgotPasswordDto {
    @IsString()
    @IsEmail()
    @IsOptional()
    @ApiPropertyOptional()
    readonly email?: string

    @IsString()
    @IsOptional()
    @ApiPropertyOptional()
    readonly phonenumber?: string
}
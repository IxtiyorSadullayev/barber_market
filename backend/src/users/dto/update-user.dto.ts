import { ApiProperty, ApiPropertyOptional, PartialType } from '@nestjs/swagger';
import { CreateUserDto } from './create-user.dto';
import { IsOptional, IsString } from 'class-validator';

export class UpdateUserDto extends PartialType(CreateUserDto) {
    @IsString()
    @IsOptional()
    @ApiPropertyOptional()
    firstname?: string;

    @IsString()
    @IsOptional()
    @ApiPropertyOptional()
    lastname?: string;

    @IsString()
    @IsOptional()
    @ApiPropertyOptional()
    phonenumber?: string;

    @IsString()
    @IsOptional()
    @ApiPropertyOptional()
    email?: string;

    @IsString()
    @IsOptional()
    @ApiPropertyOptional()
    password?: string;

    @IsString()
    @IsOptional()
    @ApiPropertyOptional()
    image?: string

    @IsString()
    @IsOptional()
    @ApiPropertyOptional()
    gender?: string;
}

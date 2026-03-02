import { IsBoolean, IsInt, IsNotEmpty, IsNumber, IsString, MaxLength, MinLength } from "class-validator";

export class CreateTaskDto {
    @IsString()
    @IsNotEmpty()
    @MinLength(3)
    @MaxLength(100)
    name: string;

    @IsNotEmpty()
    @IsString()
    @MinLength(3)
    @MaxLength(500)
    description: string;

    @IsNotEmpty()
    @IsBoolean()
    priority: boolean;

    @IsNumber()
    @IsInt()
    user_id: number;    



}
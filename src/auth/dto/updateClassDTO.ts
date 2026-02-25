import { IsBoolean, IsOptional, IsString, MaxLength, MinLength } from "class-validator";

export class updateTaskDTO {

    @IsString({ message: 'Debe ser una cadena' })
    @MinLength(3, {
        message: 'Debe tener al menos 3 caracteres'
    })
    @MaxLength(100)
    @IsOptional()
    name?: string;

    @IsOptional()
    @IsString({ message: 'Debe ser una cadena' })
    @MinLength(3, {
        message: 'Debe tener al menos 3 caracteres'
    })
    @MaxLength(250)
    description?: string;
    @IsBoolean()
    @IsOptional()
    priority?: boolean;


}
import { IsString, IsNumber, IsLatitude, IsLongitude, ValidateIf, IsNotEmpty, IsArray, IsOptional } from 'class-validator';

export class CreatePlaceDto {
    @IsString()
    name: string;

    @IsString()
    type: string;

    @IsString()
    tag: string;

    @IsLatitude()
    lat: number;

    @IsLongitude()
    lon: number;
}

export class SearchPlaceDto {
    @ValidateIf((dto) => !dto.geofenceBoundary)
    @IsArray()
    origin?: [number, number]; // [longitude, latitude]

    @ValidateIf((dto) => !dto.geofenceBoundary)
    @IsNumber()
    distance?: number; // Distance in meters

    @ValidateIf((dto) => !dto.origin || !dto.distance)
    @IsArray()
    geofenceBoundary?: number[][]; // Polygon boundary

    @IsOptional()
    @IsString()
    name?: string;

    @IsOptional()
    @IsString()
    tag?: string;

    @IsOptional()
    @IsString()
    type?: string;
}

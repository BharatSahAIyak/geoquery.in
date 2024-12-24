import { Injectable, Logger } from "@nestjs/common";
import { CreatePlaceDto, SearchPlaceDto } from "./dto/place.dto";
import { PrismaService } from "../prisma/prisma.service";
import { Prisma } from "@prisma/client";

@Injectable()
export class PlaceService {
    private readonly logger = new Logger(PlaceService.name);

    constructor(private readonly prisma: PrismaService) { }

    async createPlace(createPlaceDto: CreatePlaceDto): Promise<any> {
        const { name, type, tag, lat, lon } = createPlaceDto;
    
        const query = `
            INSERT INTO "Place" (name, type, tag, location)
            VALUES ($1, $2, $3, ST_SetSRID(ST_MakePoint($4, $5), 4326)::geography)
        `;
    
        this.logger.debug(`Adding place: ${JSON.stringify(createPlaceDto)}`);
        return this.prisma.$executeRawUnsafe(query, name, type, tag, lon, lat);
    }
    
    


    async searchPlaces(searchPlaceDto: SearchPlaceDto): Promise<any> {
        const { origin, distance, name, tag, type } = searchPlaceDto;
    
        if (!origin || !distance) {
            throw new Error('Origin and distance are required for radial searches.');
        }
    
        const [longitude, latitude] = origin;
    
        // Construct the base query
        let query = Prisma.sql`
            SELECT id, name, type, tag, ST_AsText(location::geometry) as location
            FROM "Place"
            WHERE ST_DWithin(location, ST_SetSRID(ST_MakePoint(${longitude}, ${latitude}), 4326)::geography, ${distance})
        `;
    
        // Add filters dynamically
        if (name) {
            query = Prisma.sql`${query} AND name ILIKE ${`%${name}%`}`;
        }
        if (tag) {
            query = Prisma.sql`${query} AND tag ILIKE ${`%${tag}%`}`;
        }
        if (type) {
            query = Prisma.sql`${query} AND type ILIKE ${`%${type}%`}`;
        }
    
        this.logger.debug(`Executing search query: ${query.statement}`);
        return this.prisma.$queryRaw(query);
    }
    
    
}

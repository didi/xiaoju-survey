import { Controller, Get, HttpCode, Request, UseGuards } from "@nestjs/common";
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";
import { data } from "cheerio/lib/api/attributes";
import { Authentication } from "src/guards/authentication.guard";



@ApiTags('recycleBin')
@ApiBearerAuth()
@UseGuards(Authentication)
@Controller('/api/recycleBin')
export class RecycleBinController {

    @Get('/count')
    @HttpCode(200)
    async getCount(@Request() req) {
        return {
            code: 200,
            data: {
                count: 12345
            }
        }
    }
}
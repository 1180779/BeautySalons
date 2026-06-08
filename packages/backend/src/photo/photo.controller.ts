import {Controller, Get, NotFoundException, Param, Res} from '@nestjs/common';
import {PlacesClient} from '@googlemaps/places';
import type {Response} from 'express';

const client = new PlacesClient();

@Controller('photos')
export class PhotoController {
    @Get('*name')
    async proxy(@Param('name') name: string, @Res() res: Response) {
        const [media] = await client.getPhotoMedia({
            name: `places/${name}`,
            maxWidthPx: 800,
        });

        if (!media.photoUri) throw new NotFoundException();

        res.redirect(media.photoUri);
    }
}

import { Controller, Get, Post, Body, Patch, Param, Delete, Render, UploadedFile, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import type { Express } from 'express';
import * as fs from 'fs';
import * as path from 'path';
import { diskStorage } from 'multer';
import { ImagesService } from './images.service';
import { CreateImageDto } from './dto/create-image.dto';
import { UpdateImageDto } from './dto/update-image.dto';

@Controller('images')
export class ImagesController {
  constructor(private readonly imagesService: ImagesService) {}
 
  @Post()
  @UseInterceptors(FileInterceptor('filePath', {
    storage: diskStorage({
      destination: path.join(__dirname, '..', '..', '..', 'static', 'img'),
      filename: (req, file, callback) => { callback(null, Date.now() + '-' + file.originalname); }
    })
  }))
  create(@Body() createImageDto: CreateImageDto, @UploadedFile() file: Express.Multer.File) {
    return this.imagesService.create(createImageDto, file);
  }
    

  @Get()
  @Render('images')
  findAll() {
    return this.imagesService.findAll();
  }

  @Get(':filePath')
  @Render('image')
  findOne(@Param('filePath') filePath: string) {
    return this.imagesService.findOne(filePath);
  }

  @Patch(':filePath')
  update(@Param('filePath') filePath: string, @Body() updateImageDto: UpdateImageDto) {
    return this.imagesService.update(filePath, updateImageDto);
  }

  @Patch(':filePath/hype')
  updateHype(
    @Param('filePath') filePath: string,
    @Body('isHype') isHypeRaw: boolean | string,
  ) {
    const isHype =
      typeof isHypeRaw === 'boolean'
        ? isHypeRaw
        : String(isHypeRaw).toLowerCase() === 'true';

    return this.imagesService.setHype(filePath, isHype);
  }

  @Delete(':filePath')
  remove(@Param('filePath') filePath: string) {
    return this.imagesService.remove(filePath);
  }
}

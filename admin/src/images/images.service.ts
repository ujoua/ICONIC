import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateImageDto } from './dto/create-image.dto';
import { UpdateImageDto } from './dto/update-image.dto';
import * as fs from 'fs';
import * as path from 'path';
import { diskStorage } from 'multer';

@Injectable()
export class ImagesService {
  private data: any[] = [];
  private readonly dataPath = path.join(__dirname, '..', '..', '../', 'photos-data.json');

  constructor() {
    this.loadData();
  }

  private loadData() {
    const raw = fs.readFileSync(this.dataPath, 'utf-8');
    this.data = JSON.parse(raw);
  }

  private saveData(data: any) {
    fs.writeFileSync(this.dataPath, JSON.stringify(data, null, 2));
  }

  private normalizeArrayField(
    value: string | string[] | undefined,
  ): string[] | undefined {
    if (value === undefined) return undefined;
    if (Array.isArray(value)) return value;
    const trimmed = value.trim();
    if (!trimmed) return [];
    return trimmed.split(',').map((v) => v.trim());
  }

  create(createImageDto: CreateImageDto, file: Express.Multer.File) {
    if (!file) {
      throw new BadRequestException('이미지 파일이 필요합니다.');
    }

    const nextId =
      (this.data
        .map((item) => item.id ?? 0)
        .reduce((max, cur) => (cur > max ? cur : max), 0) || 0) + 1;

    const tags = this.normalizeArrayField(createImageDto.tags);
    const materials = this.normalizeArrayField(createImageDto.materials);

    const newItem = {
      ...createImageDto,
      tags: tags ?? createImageDto.tags,
      materials: materials ?? createImageDto.materials,
      filePath: file.filename,
      id: nextId,
    };

    this.data.push(newItem);
    this.saveData(this.data);
    return newItem;
  }

  findAll() {
    return { images: this.data };
  }

  findOne(filePath: string) {
    const image = this.data.find(p => p.filePath === filePath);
    return { image: image };
  }

  update(filePath: string, updateImageDto: UpdateImageDto) {
    const index = this.data.findIndex((p) => p.filePath === filePath);
    if (index === -1) {
      throw new BadRequestException('해당 이미지를 찾을 수 없습니다.');
    }

    const current = this.data[index];

    const tags =
      updateImageDto.tags !== undefined
        ? this.normalizeArrayField(updateImageDto.tags)
        : undefined;
    const materials =
      updateImageDto.materials !== undefined
        ? this.normalizeArrayField(updateImageDto.materials)
        : undefined;

    const updated = {
      ...current,
      ...updateImageDto,
      ...(tags !== undefined ? { tags } : {}),
      ...(materials !== undefined ? { materials } : {}),
    };

    this.data[index] = updated;
    this.saveData(this.data);

    return { image: updated };
  }

  remove(filePath: string) {
    const index = this.data.findIndex((p) => p.filePath === filePath);
    if (index === -1) {
      throw new BadRequestException('해당 이미지를 찾을 수 없습니다.');
    }

    const [removed] = this.data.splice(index, 1);
    this.saveData(this.data);

    const imageAbsolutePath = path.join(
      __dirname,
      '..',
      '..',
      '..',
      'static',
      'img',
      filePath,
    );

    if (fs.existsSync(imageAbsolutePath)) {
      fs.unlinkSync(imageAbsolutePath);
    }

    return { image: removed, deleted: true };
  }
}

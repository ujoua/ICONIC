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
  private readonly hypePath = path.join(__dirname, '..', '..', '../', 'hype.json');
  private hypeFiles: string[] = [];

  constructor() {
    this.loadData();
    this.loadHypeData();
  }

  private loadData() {
    const raw = fs.readFileSync(this.dataPath, 'utf-8');
    this.data = JSON.parse(raw);
  }

  private saveData(data: any) {
    fs.writeFileSync(this.dataPath, JSON.stringify(data, null, 2));
  }

  private loadHypeData() {
    if (!fs.existsSync(this.hypePath)) {
      this.hypeFiles = [];
      return;
    }

    const raw = fs.readFileSync(this.hypePath, 'utf-8');
    const parsed = JSON.parse(raw);
    this.hypeFiles = Array.isArray(parsed)
      ? parsed.filter((item) => typeof item === 'string')
      : [];
  }

  private saveHypeData() {
    fs.writeFileSync(this.hypePath, JSON.stringify(this.hypeFiles, null, 2));
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
    const hypeSet = new Set(this.hypeFiles);
    const images = this.data.map((image) => ({
      ...image,
      isHype: hypeSet.has(image.filePath),
    }));

    return {
      images,
      hypeCount: this.hypeFiles.length,
    };
  }

  findOne(filePath: string) {
    const image = this.data.find(p => p.filePath === filePath);
    return {
      image: image ? { ...image, isHype: this.hypeFiles.includes(image.filePath) } : image,
    };
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

    if (this.hypeFiles.includes(filePath)) {
      this.hypeFiles = this.hypeFiles.filter((item) => item !== filePath);
      this.saveHypeData();
    }

    return { image: removed, deleted: true };
  }

  setHype(filePath: string, isHype: boolean) {
    const image = this.data.find((p) => p.filePath === filePath);
    if (!image) {
      throw new BadRequestException('해당 이미지를 찾을 수 없습니다.');
    }

    const hypeSet = new Set(this.hypeFiles);
    if (isHype) {
      hypeSet.add(filePath);
    } else {
      hypeSet.delete(filePath);
    }

    this.hypeFiles = Array.from(hypeSet);
    this.saveHypeData();

    return {
      filePath,
      isHype: hypeSet.has(filePath),
      hypeCount: hypeSet.size,
    };
  }
}

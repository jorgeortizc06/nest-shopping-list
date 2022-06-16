import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateItemDto } from './dto/create-item.dto';
import { UpdateItemDto } from './dto/update-item.dto';
import { Item } from './entities/item.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class ItemService {
  constructor(
    @InjectRepository(Item) private readonly repository: Repository<Item>,
  ) {}

  create(createItemDto: CreateItemDto): Promise<Item> {
    const item = this.repository.create(createItemDto);
    return this.repository.save(item);
  }

  findAll(): Promise<Item[]> {
    return this.repository.find();
  }

  findOne(id: string): Promise<Item> {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    return this.repository.findOne(id);
  }

  async update(id: string, updateItemDto: UpdateItemDto): Promise<Item> {
    const item = await this.repository.preload({
      id: id,
      ...updateItemDto,
    });

    if (!item) {
      throw new NotFoundException(`Item ${id} not found`);
    }
    return this.repository.save(item);
  }

  async remove(id: string) {
    const item = await this.findOne(id);
    return this.repository.remove(item);
  }
}

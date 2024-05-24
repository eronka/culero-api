import { PipeTransform, Injectable } from '@nestjs/common';

@Injectable()
export class LowercasePipe implements PipeTransform {
  transform(value: string) {
    return value.toLowerCase();
  }
}

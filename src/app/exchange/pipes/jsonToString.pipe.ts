import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'jsonToString',
  standalone: true,
})
export class JsonToStringPipe implements PipeTransform {
  transform(value: any): string {
    if (value === null) return '0';
    let item = JSON.parse(value);
    let number = item?.value ? Number(item?.value) : Number(item);
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(number);
  }
}

import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'getArray',
  standalone: true,
})
export class GetArrayPipe implements PipeTransform {
  transform(value: any): any[] {
    if (value) {
      const v = JSON.parse(value)?.value || [];
      let array = v.map((item: any) => {
        return {
          date: item[0],
          value: Number(item[1])?.toFixed(3),
        };
      });
      return array.sort((a: any, b: any) => b.date - a.date);
    }
    return [];
  }
}

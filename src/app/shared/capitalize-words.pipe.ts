import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'capitalizeWords'
})
export class CapitalizeWordsPipe implements PipeTransform {

  transform(value: string | null): string | null {
    if (!value) return '';

    return value
      .split(' ')
      .map(word => 
        word.length > 0 
          ? word.charAt(0).toUpperCase() + word.slice(1).toLowerCase() 
          : ''
      )
      .join(' ');
  }

}

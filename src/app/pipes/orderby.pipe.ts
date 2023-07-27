import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'orderBy',
})
export class OrderbyPipe implements PipeTransform {
  transform(array: Array<any>, args: string): Array<any> {
    if (!array) {
      return array;
    }
    return array.sort((a: any, b: any) => {
      if (
        this.getPropertyByString(a, args) < this.getPropertyByString(b, args)
      ) {
        return -1;
      } else if (
        this.getPropertyByString(a, args) < this.getPropertyByString(b, args)
      ) {
        return 1;
      }
      return 0;
    });
  }

  getPropertyByString(obj: any, propString: string) {
    if (!propString) return obj;
    let prop,
      props = propString.split('.');

    for (var i = 0, iLen = props.length - 1; i < iLen; i++) {
      prop = props[i];
      let candidate = obj[prop];
      if (candidate !== undefined) {
        obj = candidate;
      } else {
        break;
      }
    }
    return obj[props[i]];
  }
}

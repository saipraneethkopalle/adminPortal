import { Directive, ElementRef, HostListener } from '@angular/core';

@Directive({
  selector: '[appRemoveNegativeSign]'
})
export class RemoveNegativeSignDirective {

  constructor(private el: ElementRef) { }

  @HostListener('input', ['$event']) onInputChange(event:any) {
    const initalValue = this.el.nativeElement.value;
    this.el.nativeElement.value = initalValue.replace(/-/g, '');
    if ( initalValue !== this.el.nativeElement.value) {
      event.stopPropagation();
    }
  }

}

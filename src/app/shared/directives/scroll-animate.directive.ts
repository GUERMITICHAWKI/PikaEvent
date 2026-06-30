import { Directive, ElementRef, Input, OnInit } from '@angular/core';

@Directive({
  selector: '[scrollAnimate]',
  standalone: true
})
export class ScrollAnimateDirective implements OnInit {

  @Input() animationClass = 'animate-fade-up';
  @Input() delay = '0ms';

  constructor(private el: ElementRef) {}

  ngOnInit() {
    const element = this.el.nativeElement;

    // Style initial
    element.style.opacity = '0';
    element.style.transitionDelay = this.delay;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            element.style.opacity = '1';
            element.classList.add(this.animationClass);
            observer.unobserve(element);
          }
        });
      },
      { threshold: 0.1 }
    );

    observer.observe(element);
  }
}
import { DOCUMENT } from '@angular/common';
import { Component, Inject, Renderer2 } from '@angular/core';
import { FlexLayoutModule } from '@angular/flex-layout';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'tic-tac-toe';
  isDarkMode = false;
  themeName = 'theme-light';
  currentColor = '';

  constructor( private renderer: Renderer2, @Inject(DOCUMENT) private document: Document){
    // Get theme from local storage when refresh.
    this.themeName = localStorage.getItem('themeName') || 'theme-light';
    if (this.themeName === 'theme-dark') {
      this.switchMode({checked: true});
      this.isDarkMode = true;
    } else {
      this.switchMode({checked: false});
      this.isDarkMode = false;
    }
  }

  switchMode(isDarkMode: any) {
    // Switch theme between dark and light modes.
    this.themeName = isDarkMode.checked ? 'theme-dark' : 'theme-light';
    this.currentColor = isDarkMode.checked ? 'dark' : 'light';
    this.isDarkMode = isDarkMode.checked ? true : false;
    this.renderer.setAttribute(this.document.body, 'class', this.themeName);
    document.documentElement.setAttribute('data-theme', this.currentColor);
    localStorage.setItem('themeName', this.themeName);
  }
}

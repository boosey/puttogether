import { Component } from '@stencil/core';

@Component({
  tag: 'app-home',
  styleUrl: 'app-home.css'
})
export class AppHome {

  private menu

  render() {
    return [
      <app-mainmenu ref={(el) => this.menu = el}></app-mainmenu>,

      <ion-header>
        <ion-toolbar color="primary">
        <ion-buttons slot="start">
          <ion-menu-toggle menu="start">
            <ion-button>
              <ion-icon slot="icon-only" name="menu"></ion-icon>
            </ion-button>
          </ion-menu-toggle>
        </ion-buttons>
        <ion-buttons slot="end">
          <ion-button href="/addgame">
            <ion-icon slot="icon-only" name="add"></ion-icon>
          </ion-button>
        </ion-buttons>
        <ion-title>What Can I Bring?</ion-title>
        </ion-toolbar>
      </ion-header>,

      <ion-content padding>
        <p>
          Welcome to the PWA Toolkit. You can use this starter to build entire
          apps with web components using Stencil and ionic/core! Check out the
          README for everything that comes in this starter out of the box and
          check out our docs on <a href="https://stenciljs.com">stenciljs.com</a> to get started.
        </p>

      </ion-content>
    ];
  }
}

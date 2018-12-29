
import { Component, Event, EventEmitter, Prop } from '@stencil/core';

@Component({
    tag: 'app-subpage-header',
    styleUrl: 'app-subpage-header.css'
})

export class AppSubpageHeader {

    @Prop() titleText: string = 'Set a Page Title'
    @Prop() button: string

    render() {
        return [
            <ion-toolbar color="primary">
              <ion-buttons slot="start">
                <ion-back-button defaultHref="/"></ion-back-button>
              </ion-buttons>
              <ion-title>{this.titleText}</ion-title>
              {this.button !== null ?
                <ion-buttons slot="end">
                  <ion-button>
                    <ion-icon slot="icon-only" name={this.button}></ion-icon>
                  </ion-button>
                </ion-buttons>
               : ''
              }
            </ion-toolbar>
        ]
    }
}

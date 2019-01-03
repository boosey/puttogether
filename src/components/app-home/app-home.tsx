import { Component, Prop, State, Event, EventEmitter, Listen } from '@stencil/core';
import { Subject } from "rxjs";

@Component({
  tag: 'app-home',
  styleUrl: 'app-home.css'
})
export class AppHome {

  @Prop()  userid: string = null
  @State() events = null

  @Event() loadEventsRequested: EventEmitter

  private menu
  private loading = false;

  componentDidLoad() {

    if (this.userid !== null) {
      var requestStatus = (new Subject())
        .subscribe((events) => this.events = events)

      var request = {
        data: {'userid' : this.userid},
        status: requestStatus
      }
      this.loadEventsRequested.emit(request)
    }

  }

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
          <ion-button href={"/"+ this.userid + "/events/add"}>
            <ion-icon slot="icon-only" name="add"></ion-icon>
          </ion-button>
        </ion-buttons>
        <ion-title>What Can I Bring?</ion-title>
        </ion-toolbar>
      </ion-header>,

      <ion-content padding>
        <ion-loading-controller></ion-loading-controller>
        <ion-list>
          {this.events ? this.events.map((e) => (
              <ion-card>
                <ion-card-header>
                  <ion-card-title>{e.name}</ion-card-title>
                </ion-card-header>
                <ion-card-content>
                  <ion-grid>
                    <ion-row>
                     <ion-col>
                        <ion-button
                          href={("/" + this.userid + "/events/" + e.eventId + "/edit")}
                          fill="outline" >
                        Edit
                        </ion-button>
                     </ion-col>
                     <ion-col />
                    </ion-row>
                  </ion-grid>
                </ion-card-content>
              </ion-card>
          )) : ''}
        </ion-list>
      </ion-content>
    ];
  }
}

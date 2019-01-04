import { Component, Prop, State, Event, EventEmitter, Listen } from '@stencil/core';
import { Subject } from "rxjs";
import { format } from 'date-fns';


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
                  <ion-toolbar>
                    <ion-buttons slot="end">
                      <ion-button href={("/" + this.userid + "/events/" + e.eventId + "/edit")}>
                        <ion-icon slot="icon-only" name="create"></ion-icon>
                      </ion-button>
                      <ion-button href={("/" + this.userid + "/events/" + e.eventId + "/items")}>
                        <ion-icon slot="icon-only" name="list"></ion-icon>
                      </ion-button>
                    </ion-buttons>
                  </ion-toolbar>
                </ion-card-header>
                <ion-card-content>
                  <ion-card-title>{e.name}</ion-card-title>
                  <ion-item lines="none">
                    {format(e.datetime, "dddd, MMM D, YYYY hh:mmA")}
                  </ion-item>
                  <ion-item lines="none">
                    {e.attendees}
                  </ion-item>
                </ion-card-content>
              </ion-card>
          )) : ''}
        </ion-list>
      </ion-content>
    ];
  }
}

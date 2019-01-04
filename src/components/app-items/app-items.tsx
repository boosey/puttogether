import { Component, Prop, State, Event, EventEmitter, Listen } from '@stencil/core';
import { Subject } from "rxjs";


@Component({
  tag: 'app-items',
  styleUrl: 'app-items.css'
})
export class AppItems {

  @Prop()  userid: string = null
  @Prop()  eventId: string = null
  @State() items = null

  @Event() loadItemsRequested: EventEmitter

  componentDidLoad() {

    if (this.userid !== null && this.eventId != null) {
      var requestStatus = (new Subject())
        .subscribe((items) => this.items = items)

      var request = {
        data: {'userid' : this.userid, 'eventId' : this.eventId},
        status: requestStatus
      }
      this.loadItemsRequested.emit(request)
    }
  }

  render() {
    return [

      <ion-header>
        <app-subpage-header titleText="Items" button="add"></app-subpage-header>
      </ion-header>,

      <ion-content padding>
        <ion-loading-controller></ion-loading-controller>
        <ion-list>
          {this.items ? this.items.map((i) => (
            <ion-card>
               <ion-item>
                {i.name}
               </ion-item>
            </ion-card>
          )) : ''}
        </ion-list>
      </ion-content>
    ];
  }
}

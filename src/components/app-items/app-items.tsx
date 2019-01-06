import { Component, Prop, State, Event, EventEmitter, Listen } from '@stencil/core';
import { Subject } from "rxjs";

declare global {
  export interface Item {
    itemId?: string
    eventId: string
    creator: string
    name: string
  }
}

@Component({
  tag: 'app-items',
  styleUrl: 'app-items.css'
})
export class AppItems {

  @Prop()  userid: string = null
  @Prop()  eventId: string = null
  @State() items = null

  @Event() loadItemsRequested: EventEmitter
  @Event() updateItemRequested: EventEmitter
  @Event() deleteItemRequested: EventEmitter

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

  @Listen('subpageHeaderButtonClicked')
  subpageHeaderButtonClickedHandler(ev) {
    this.requestAddItem();
  }

  requestAddItem() {
    var newItem: Item = { eventId: this.eventId, creator: this.userid, name:''}

    var requestStatus = new Subject()
    var requestSubscription = requestStatus.subscribe(
      (newItemRef) => (null),
      () => console.log("Error adding item"),
      () => { // Set focus to new item input control
        }
    )
    var request = { item: newItem, status: requestStatus}
    this.updateItemRequested.emit(request)
  }

  @Listen('itemUpdated')
  requestUpdateItem(ev) {

    var requestStatus = new Subject()
    var requestSubscription = requestStatus.subscribe(
      (newItemRef) => (null),
      () => console.log("Error updating item"),
      () => { // Set focus to new item input control
        }
    )
    var request = { item: ev.detail, status: requestStatus}
    this.updateItemRequested.emit(request)
  }

  @Listen('itemDeleted')
  requestDeleteItem(ev) {

    var requestStatus = new Subject()
    var requestSubscription = requestStatus.subscribe(
      () => {},
      () => console.log("Error updating item"),
      () => {}
    )
    var request = { item: ev.detail, status: requestStatus}
    this.deleteItemRequested.emit(request)
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
            <app-item item={i} />
          )) : ''}
        </ion-list>
      </ion-content>
    ];
  }
}


import { Component, Event, EventEmitter, Prop, State, Watch, Listen } from '@stencil/core';
import { Subject, from } from "rxjs";
import { first } from 'rxjs/operators';
import { parse, format, setYear, setDate, setMonth, setHours, setMinutes } from 'date-fns';
import tointeger from 'lodash.tointeger'

@Component({
    tag: 'app-edit-event',
    styleUrl: 'app-edit-event.css'
})

export class AppEditEvent {

    @Prop() eventId = null;
    @Prop() userid = null;

    @State() currentEvent = {
      name: '',
      datetime: this.formatDateTime(new Date()),
      attendees: "6"
    }

    private startDatePicker
    private startTimePicker
    private dateAsDate
    private timeAsDate
    private datetimeAsDate

    @Event() loadEventFromIdRequested: EventEmitter
    @Event() updateEventRequested: EventEmitter

    formatDateTime(theDate): string {
      return format(theDate, "YYYY-MM-DDThh:mm:ssZ")
    }

    componentWillLoad() {
      if (this.eventId !== null) {
        var requestStatus = (new Subject())
        .pipe(first())
        .subscribe((loadedEvent) => {
          this.currentEvent = {...this.currentEvent, ...loadedEvent}
          // from string to date
          this.datetimeAsDate = parse(this.currentEvent.datetime)
         })

        var request = { data: this.eventId, status: requestStatus}
        this.loadEventFromIdRequested.emit(request)
      }
    }

    componentDidLoad() {
      this.startDatePicker.addEventListener('ionChange', (ev) => {
          this.changeValue(ev)
        })

      this.startTimePicker.addEventListener('ionChange', (ev) => {
          this.changeValue(ev)
        })

    }

    changeValue(ev){
      let value = ev.target.value;
      switch(ev.target.name){

        case 'name':
          this.currentEvent.name = value;
          break;

          case 'attendees':
            this.currentEvent.attendees = value;
            break;

        case 'event-time':
          this.datetimeAsDate =
            setHours(this.datetimeAsDate, tointeger(format(value, "hh")))
          this.datetimeAsDate =
            setMinutes(this.datetimeAsDate, tointeger(format(value, "mm")))
          break;

        case 'event-date':
          this.datetimeAsDate =
            setYear(this.datetimeAsDate, tointeger(format(value, "YYYY")))
          // Apparently the month is 0-based
          this.datetimeAsDate =
            setMonth(this.datetimeAsDate, tointeger(format(value, "MM"))-1)
          this.datetimeAsDate =
            setDate(this.datetimeAsDate, tointeger(format(value, "DD")))
          break;
      }
    }

    requestUpdateEvent() {
      var requestStatus = new Subject()
      var requestSubscription = requestStatus.subscribe(
        (eventRef) => (null),
        () => console.log("Error updating event"),
        () => {
            const nav: HTMLIonNavElement = document.querySelector('ion-nav')
            if (nav && nav.canGoBack()) {
                return nav.pop({ skipIfBusy: true });
            }
        }
      )
      this.currentEvent.datetime = this.formatDateTime(this.datetimeAsDate)
      var request = {
        eventId: this.eventId,
        creator: this.userid,
        data: this.currentEvent,
        status: requestStatus
      }
      this.updateEventRequested.emit(request)
    }

    render() {
        return [
          <ion-header>
            <app-subpage-header titleText="Edit Event"></app-subpage-header>
          </ion-header>,

          <ion-content padding>
          <ion-list>
              <ion-item>
                  <ion-label position="stacked">Event Name</ion-label>
                  <ion-input
                    name="name"
                    value={this.currentEvent.name}
                    placeholder="Enter name"
                    onInput={(ev) => this.changeValue(ev)}
                    type="text"></ion-input>
              </ion-item>
              <ion-item lines="none">
                <ion-icon name="calendar" />
                <ion-datetime
                  name="event-date"
                  ref={(el)=>this.startDatePicker = el}
                  display-format="MMM D, YYYY"
                  onChange={(ev) => this.changeValue(ev)}
                  value={this.currentEvent.datetime}>
                </ion-datetime>
              </ion-item>
              <ion-item lines="none">
              <ion-icon name="clock" />
                <ion-datetime
                  name="event-time"
                  ref={(el)=>this.startTimePicker = el}
                  display-format="h:mmA"
                  onChange={(ev) => this.changeValue(ev)}
                  value={this.currentEvent.datetime}>
                </ion-datetime>
              </ion-item>
              <ion-item>
                  <ion-label position="stacked">Number of Attendees</ion-label>
                  <ion-input
                    name="attendees"
                    value={this.currentEvent.attendees}
                    placeholder="Number of Attendees"
                    onInput={(ev) => this.changeValue(ev)}
                    type="number"></ion-input>
              </ion-item>
          </ion-list>

          <ion-button onClick={() => this.requestUpdateEvent()}>Update</ion-button>
          </ion-content>
        ]
    }
}

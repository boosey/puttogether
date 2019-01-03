<reference types="firebase" />

declare var firebase: firebase.app.App;

import { Component, Prop, Listen, Event, EventEmitter, State } from '@stencil/core';
import { authState } from 'rxfire/auth';
import { collectionData, docData } from 'rxfire/firestore';
import { filter, first } from 'rxjs/operators';
import { from, Subject } from 'rxjs';

@Component({
  tag: 'app-commands'
})

export class AppCommands {

  @Event() userUpdated: EventEmitter

  private eventsCollectionRef = firebase.firestore().collection('events')

  componentWillLoad() {
    // User logged out
    authState(firebase.auth())
      .pipe(filter(user => user === null))
      .subscribe(() => {
        var newUser = null;
        this.userUpdated.emit(newUser)
    })
    // User logged in
    authState(firebase.auth())
      .pipe(filter(user => user !== null))
      .subscribe((user) => {
        var newUser = user;
        this.userUpdated.emit(newUser)
    })
  }

  @Listen('loadEventFromIdRequested')
  loadEventFromIdRequestedHandler(ev) {
    var eventId = ev.detail.data
    var status = ev.detail.status
    var eventRef = this.eventsCollectionRef.doc(eventId)

    docData(eventRef).pipe(first()).subscribe((doc) => status.next(doc))

  }

  @Listen('loadEventsRequested')
  loadEventsRequestedHandler(ev) {
    var uid = ev.detail.data ? ev.detail.data.userid : ''
    var status = ev.detail.status

    if (typeof uid !== 'undefined' && uid !== null) {
      var eventsQuery = this.eventsCollectionRef
        .where('creator', "==", uid)

      collectionData(eventsQuery, "eventId").subscribe(
         (event) => status.next(event),
         () => console.log("Error getting events"),
         () => status.complete()
      )

    } else {
      status.complete()
    }
  }

  @Listen('updateEventRequested')
  updateEventRequestedHandler(ev) {
    var status = ev.detail.status
    var eventId = ev.detail.eventId
    var curEvent = ev.detail.data
    curEvent.creator = ev.detail.creator

    if (typeof eventId === 'undefined' ||
               eventId === null) {
      this.eventsCollectionRef
        .add(curEvent)
        .then((newDocRef)=> {
          status.next(newDocRef)
          status.complete()
      })
    } else {
        this.eventsCollectionRef.doc(eventId)
          .update(curEvent)
          .then(status.complete())
    }
  }

  @Listen('loginRequested')
  loginRequestedHandler(ev) {
    var status = ev.detail.status
    var provider = new (firebase.auth as any).GoogleAuthProvider()
    var loginObservable = from(firebase.auth().signInWithPopup(provider))
    loginObservable.subscribe(
      () => status.next(),
      () => status.error(),
      () => status.complete()
    )
  }
  @Listen('logoutRequested')
  logoutRequestedHandler(ev) {
    var status = ev.detail.status
    var loginObservable = from(firebase.auth().signOut())
    loginObservable.subscribe(
      () => status.next(),
      () => status.error(),
      () => status.complete()
    )
  }

}

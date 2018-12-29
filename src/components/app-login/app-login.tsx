import { Component, Event, EventEmitter } from '@stencil/core';
import { Subject } from "rxjs";

@Component({
  tag: 'app-login',
  styleUrl: 'app-login.css'
})
export class AppLogin {

  @Event() loginRequested: EventEmitter
  @Event() loginCompleted: EventEmitter

  private googleButton

  componentDidLoad() {
  }

  requestLogin() {
    var requestStatus = (new Subject())
    .subscribe(
      () => {},
      () => {},
      () => { this.loginCompleted.emit() }
    )

    var request = {status: requestStatus}
    this.loginRequested.emit(request)
  }

  render() {
    return [
      <ion-header>
        <ion-toolbar color="primary">
          <ion-title>Login</ion-title>
        </ion-toolbar>
      </ion-header>,

      <ion-content padding>
      <ion-item lines="none">
        <ion-button class="google-button" onClick={()=>this.requestLogin()}>
            <ion-icon slot="start" name="logo-google"></ion-icon>
            <ion-label>Sign In With Google</ion-label>
        </ion-button>
      </ion-item>
      </ion-content>
    ];
  }
}

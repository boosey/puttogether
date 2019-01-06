import { Component, Prop, State, Event, EventEmitter, Listen, Element } from '@stencil/core';
import { Subject } from "rxjs";

@Component({
  tag: 'app-item',
  styleUrl: 'app-item.css'
})
export class AppItem {

  @Prop()  item: Item
  @State() showTrashCan: boolean = false

  @Event() itemUpdated: EventEmitter
  @Event() itemDeleted: EventEmitter

  private originalName: string = null
  private itemValueInput = null

  componentDidLoad() {
    this.itemValueInput.addEventListener('ionChange', (ev) => {
        this.changeValue(ev)
      })

    this.itemValueInput.addEventListener('ionBlur', (ev) => {
        this.inputBlurred(ev)
      })

    this.itemValueInput.addEventListener('ionFocus', (ev) => {
        this.inputFocused(ev)
      })

    this.originalName = this.item.name
  }

  changeValue(ev){
    let value = ev.target.value;
    switch(ev.target.name){

      case 'itemValueInput':
        this.item.name = value;
        break;
    }
  }

  inputBlurred(ev) {
    this.showTrashCan = false
    if (this.item.name != this.originalName) {
      this.itemUpdated.emit(this.item)
    }
  }

  deleteItem(ev) {
    this.itemDeleted.emit(this.item)
  }

  inputFocused(ev) {
    this.showTrashCan = true
  }

  showingTrashCan(): string {
    return this.showTrashCan ? "show-button" : "hide-button"
  }

  render() {
    return [

        <ion-card>
           <ion-item>
            <ion-input name="itemValueInput" value={this.item.name}
                ref={(el)=> this.itemValueInput = el}
                required spellcheck
                autocomplete="on" autocapitalize="on" autocorrect="on"/>
              <ion-item lines="none" button
                  class={this.showingTrashCan()}
                  onClick={(ev)=>this.itemDeleted.emit(this.item)}>
                <ion-icon name="trash"></ion-icon>
              </ion-item>
           </ion-item>
        </ion-card>
    ];
  }
}

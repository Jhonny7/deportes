import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ControlMessagesComponent } from 'src/components/control-messages/control-messages.component';

@NgModule({
  declarations: [ControlMessagesComponent],
  exports: [ControlMessagesComponent],
  entryComponents: [
    ControlMessagesComponent,
  ],
  imports: [
    CommonModule
  ]
})
export class SharedModule {

}

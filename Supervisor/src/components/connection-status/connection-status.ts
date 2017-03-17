import { Component } from '@angular/core';
import { Subscription } from 'rxjs/Rx';
import { VariablesMonitor, ConnectionStatus, ConnectionStatusUpdate } from '../../providers/variables-monitor';

@Component({
  selector: 'connection-status',
  templateUrl: 'connection-status.html'
})

export class ConnectionStatusComponent {

  private connMonSubscription: Subscription = null;

  private icon: string = "";
  private isActive: boolean = false;
  private color: string = "danger";
  private message: string = "";

  constructor(private variablesMonitor: VariablesMonitor) {
    console.info('Create ScadaConnectionStatus component');
  }

  ngOnInit() {
    this.connMonSubscription = this.variablesMonitor.connectionStatusUpdate
      .subscribe(update => this.handleConnectionUpdate(update));
    this.updateCurrentStatus(this.variablesMonitor.connectionStatus);
  }

  ngOnDestroy() {
    if (this.connMonSubscription != null) {
      this.connMonSubscription.unsubscribe();
      this.connMonSubscription = null;
    }
  }

  private handleConnectionUpdate(status: ConnectionStatusUpdate) {
    this.updateCurrentStatus(status.new);
    this.updateMessage(status);
  }
  private updateMessage(status:ConnectionStatusUpdate){
    this.message = status.changed || status.new === ConnectionStatus.connecting
    ? status.message : "";
  }
  private updateCurrentStatus(status: ConnectionStatus) {
    switch (status) {
      case ConnectionStatus.connected:
        this.icon = "ios-pulse";
        this.color = "dark";
        this.isActive = !this.isActive;
        break;
      case ConnectionStatus.connecting:
        this.icon = "ios-pulse";
        this.color = "warning";
        this.isActive = !this.isActive;
        break;
      case ConnectionStatus.disconnected:
        this.icon = "ios-pulse";
        this.color = "danger";
        this.isActive = true;
        break;
      default:
        throw new Error("Application error: invalid connection status");
    }
  }

}

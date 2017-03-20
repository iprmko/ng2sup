import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { Subject, Observable } from 'rxjs';
import { Settings } from './settings';
import 'rxjs/add/operator/map';
import { Variable } from '../entities/variable';
import * as io from 'socket.io-client';

@Injectable()
export class VariablesMonitor {

  private variableChangeSubject = new Subject<VariableChange>();
  private connectionStatusUpdateSubject = new Subject<ConnectionStatusUpdate>();

  private clientSocket: any = null;
  public connectionStatus: ConnectionStatus;

  constructor(public http: Http, public settingsProvider: Settings) {
    console.info('Create VariablesMonitor');
  }

  public get variableChange(): Observable<VariableChange> {
    return this.variableChangeSubject.asObservable();
  }

  public get connectionStatusUpdate(): Observable<ConnectionStatusUpdate> {
    return this.connectionStatusUpdateSubject.asObservable();
  }

  public start() {
    if (this.running === true)
      throw new Error("Server already running");

    this.clientSocket = io(this.settingsProvider.config.server);
    this.clientSocket.on('connect', () => {
      this.notifyConnection(ConnectionStatus.connected, "Connected");
    });
    this.clientSocket.on('connect_error', () => {
      this.notifyConnection(ConnectionStatus.connecting, "Connection error");
    });
    this.clientSocket.on('connect_timeout', () => {
      this.notifyConnection(ConnectionStatus.connecting, "Connection timeout");
    });
    this.clientSocket.on('error', () => {
      this.notifyConnection(ConnectionStatus.connecting, "Connection lost");
    });
    this.clientSocket.on('disconnect', () => {
      this.notifyConnection(ConnectionStatus.disconnected, "Disconnected");
    });
    this.clientSocket.on('reconnect', () => {
      this.notifyConnection(ConnectionStatus.connecting, "Reconnecting");
    });
    this.clientSocket.on('pong', () => {
      this.notifyConnection(ConnectionStatus.connected, "Listening");
    });
    this.clientSocket.on('varValChanged', (variables) => {
      variables.forEach((v) => {
        // console.log("varValChanged:",v);
        this.variableChangeSubject.next(v);
      });
    });
  }
  public stop() {
    if (this.running === false) return;
    this.clientSocket.disconnect();
    this.clientSocket = null;
  }
  public get running(): boolean {
    return this.clientSocket != null;
  }

  public updateVariable(variable: Variable) {
    this.clientSocket.emit('varValUpdate', {
      name: variable.name,
      value: variable.value
    })
  }

  private notifyConnection(newStatus: ConnectionStatus, message: string) {
    this.connectionStatusUpdateSubject.next({
      old: this.connectionStatus,
      new: newStatus,
      message: message,
      changed: (this.connectionStatus !== newStatus),
    });
    this.connectionStatus = newStatus;
  }
}

export interface VariableChange {
  name: string;
  value: any;
}

export interface ConnectionStatusUpdate {
  old: ConnectionStatus;
  new: ConnectionStatus;
  message: string;
  changed: boolean;
}

export enum ConnectionStatus {
  connected,
  connecting,
  disconnected
}

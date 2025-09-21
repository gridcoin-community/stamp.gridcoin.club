import { EventEmitter } from 'node:stream';

let emitter: EventEmitter;

export function getEmitter() {
  if (!emitter) {
    emitter = new EventEmitter();
  }
  return emitter;
}

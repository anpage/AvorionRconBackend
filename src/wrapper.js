import cp from 'child_process';
import rl from 'readline';
import { GraphQLList } from 'graphql';
import async from 'async';

import serverDataStructure from './dataShapes/server.js';

const compareObjectProps = (obj1, obj2) => {
  return Object.keys(obj1).every((prop) => obj2.hasOwnProperty(prop));
};

export default class Wrapper {
  constructor(path) {
    this.avorionPath = path;

    this.serverProcess = {};
    this.serverLines = {};

    this._serverData = {};
    this._playerData = [];

    this.lookingForServerData = false;
    this.lookingforPlayerData = false;

    this._parseServerData = this._parseServerData.bind(this);
    this._parsePlayerData = this._parsePlayerData.bind(this);
    this._onServerLine = this._onServerLine.bind(this);
  }

  _parseServerData(line) {
    const wordyBits = line.split(':');
    const parsedKey = wordyBits[0];
    let parsedValue = wordyBits.slice(1).join(':').trim();

    if (parsedValue == 'yes') parsedValue = true;
    if (parsedValue == 'no') parsedValue = false;

    for (const key in serverDataStructure) {
      if (serverDataStructure.hasOwnProperty(key)) {
        const serverKey = serverDataStructure[key].label;
        if (serverKey == parsedKey) {
          if (serverDataStructure[key].type instanceof GraphQLList) {
            // Avorion lists admins as single-quoted strings separated by spaces
            parsedValue = parsedValue.split('\'').filter((v, i) => i % 2 != 0);
          }
          this._serverData[key] = parsedValue;
        }
      }
    }

    if (compareObjectProps(serverDataStructure, this._serverData)) {
      this.lookingForServerData = false;
      console.log('Wrapper: ', this._serverData);
    }
  }

  _parsePlayerData(line) {
    const wordyBits = line.split(':');
    const parsedKey = wordyBits[0];
    const parsedData = wordyBits.slice(1).join(':').trim();

    if (parsedKey == 'players') {
      this._playerData = JSON.parse(parsedData);
      console.log('Wrapper: ', parsedData);
      this.lookingForPlayerData = false;
    }
  }

  _onServerLine(line) {
    console.log('Avorion: ' + line);
    if (this.lookingForServerData) this._parseServerData(line);
    if (this.lookingForPlayerData) this._parsePlayerData(line);
  }

  startServer() {
    this._serverData = {};
    this._playerData = [];
    this.lookingForServerData = true;

    this.serverProcess = cp.spawn('./server.sh', { cwd: this.avorionPath });
    this.serverLines = rl.createInterface({ input: this.serverProcess.stdout });

    this.serverLines.on('line', this._onServerLine);
    this.serverProcess.on('close', (c) => console.log('Server has exited: ' + c));
  }

  get serverData() {
    return new Promise((resolve, reject) => {
      async.retry({ times: 15, interval: 250 }, (callback) => {
        if (this.lookingForServerData) {
          callback(true, null);
        } else {
          callback(null, true);
        }
      }, (err, results) => {
        if (results) {
          resolve(this._serverData);
        }
        reject('Timed out waiting for server data');
      });
    });
  }

  get playerData() {
    this._playerData = [];
    this.lookingForPlayerData = true;
    this.serverProcess.stdin.write('/get\n');

    return new Promise((resolve, reject) => {
      async.retry({ times: 15, interval: 250 }, (callback) => {
        if (this.lookingForPlayerData) {
          callback(true, null);
        } else {
          callback(null, true);
        }
      }, (err, results) => {
        if (results) {
          resolve(this._playerData);
        }
        reject('Timed out waiting for player data');
      });
    });
  }
}

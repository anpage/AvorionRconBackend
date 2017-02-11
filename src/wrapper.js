import cp from 'child_process';
import rl from 'readline';

import serverDataStructure from './dataShapes/server.js';

export default class Wrapper {
  constructor(path) {
    this.avorionPath = path;

    this.serverProcess = {};
    this.serverLines = {};

    this._serverData = {};
    this.playerData = {};

    this.lookingForServerData = false;
    this.lookingforPlayerData = false;

    this._parseServerInfo = this._parseServerInfo.bind(this);
    this._parsePlayerData = this._parsePlayerData.bind(this);
    this._onServerLine = this._onServerLine.bind(this);
  }

  _parseServerInfo(line) {
    const wordyBits = line.split(':');
    const parsedKey = wordyBits[0];
    const parsedValue = wordyBits.slice(1).join(':').trim();

    for (const key in serverDataStructure) {
      if (serverDataStructure.hasOwnProperty(key)) {
        const serverKey = serverDataStructure[key].label;
        if (serverKey == parsedKey) this._serverData[key] = parsedValue;
      }
    }

    if (Object.keys(serverDataStructure).every((prop) => this._serverData.hasOwnProperty(prop))) {
      this.lookingForServerData = false;
      console.log('Wrapper: ', this._serverData);
    }
  }

  _parsePlayerData(line) {
    const wordyBits = line.split(':');
    const parsedKey = wordyBits[0];
    const parsedData = wordyBits.slice(1).join(':').trim();

    if (parsedKey == 'players') {
      this.playerData = JSON.parse(parsedData);
      console.log('Wrapper: ', parsedData);
      this.lookingForPlayerData = false;
    }
  }

  _onServerLine(line) {
    console.log('Avorion: ' + line);
    if (this.lookingForServerData) this._parseServerInfo(line);
    if (this.lookingForPlayerData) this._parsePlayerData(line);
  }

  startServer() {
    this._serverData = {};
    this.playerData = {};
    this.lookingForServerData = true;

    this.serverProcess = cp.spawn('./server.sh', { cwd: this.avorionPath });
    this.serverLines = rl.createInterface({ input: this.serverProcess.stdout });

    this.serverLines.on('line', this._onServerLine);
    this.serverProcess.on('close', (c) => console.log('Server has exited: ' + c));
  }

  get serverData() {
    return this._serverData;
  }
}

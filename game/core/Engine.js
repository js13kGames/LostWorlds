import GameLoop from './GameLoop';
import Events from './Events';
import Assets from './Assets';

let instance = null;

class EngineImplementation {
  setup(canvasDOM, width, height) {
    this.canvas = canvasDOM;
    this.width = width;
    this.height = height;
    this.canvas.width = width;
    this.canvas.height = height;
    this.context = this.canvas.getContext('2d');
    this.assets = new Assets();
    this.events = new Events();

    this.loop = new GameLoop(60);
    this.scene = null;

    this.globals = null;
  }

  isMobile() {
    return this.events.isMobile;
  }

  setScene(newScene) {
    this.scene = newScene
  }

  startScene() {
    this.events.addOnPressEvent(this.canvas, this.scene);
    this.loop.start(this.scene);
  }

  removeScene() {
    this.loop.stop();
    this.scene.unload();
    this.scene = null;
    this.events.removeOnPressEvent();
  }

  _putAsset(id, asset) {
    this.assets.set(id, asset)
  }

  getAsset(id) {
    return this.assets.get(id)
  }
}

class Engine {
  constructor() {
    if (!instance) {
      instance = new EngineImplementation()
    }

    return instance;
  }
}

export default new Engine()
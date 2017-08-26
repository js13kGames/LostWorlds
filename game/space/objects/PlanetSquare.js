import Renderable from '../../core/Renderable';
import Engine from '../../core/Engine';
import { IDENTIFIERS as ASSET_IDENTIFIERS } from '../../core/Assets';

export default class PlanetSquare extends Renderable {
  getImage() {
    return Engine.getAsset(ASSET_IDENTIFIERS.PLANET_SQUARE)
  }

  inRange(x, y) {
    if (x > this.x && x < this.x + this.width &&
      y > this.y && y < this.y + this.height) {
      return true;
    }
    return false;
  }

  setId(x, y) {
    this.idX = x;
    this.idY = y;
  }

  setState(name) {
    if (name === 'active') {
      console.info(this.idX, this.idY);
      this.image = Engine.getAsset(ASSET_IDENTIFIERS.PLANET_SQUARE_ACTIVE)
    } else if (name === 'inactive') {
      this.image = Engine.getAsset(ASSET_IDENTIFIERS.PLANET_SQUARE)
    }
  }
}
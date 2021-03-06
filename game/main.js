import Engine from './core/Engine';
import { IDENTIFIERS as ASSET_IDENTIFIERS } from './core/Assets';
import { TYPES as PLANET_TYPES } from './space/objects/Planet';
import {createOpaqCircle, createOpaqSquare, createSquare, drawCat} from './core/Placeholders';
import MenuScene from "./menu/MenuScene";

const gameCanvas = document.getElementById('g');

Engine.setup(gameCanvas, 960, 540);

Engine._putAsset(
  ASSET_IDENTIFIERS.RED,
  createOpaqCircle(50, 50, 15, '#a10000', '#a10000', 2, 0.3),
);
Engine._putAsset(
  ASSET_IDENTIFIERS.BLUE,
  createOpaqCircle(50, 50, 15, '#003399', '#003399', 2, 0.3),
);
Engine._putAsset(
  ASSET_IDENTIFIERS.GREEN,
  createOpaqCircle(50, 50, 15, '#00a100', '#00a100', 2, 0.3),
);
Engine._putAsset(
  ASSET_IDENTIFIERS.SINGULARITY,
  createOpaqCircle(50, 50, 10, '#000000', '#ffffff', 1, 0.6),
);
Engine._putAsset(
  ASSET_IDENTIFIERS.CAT,
  drawCat(),
);
Engine._putAsset(
  ASSET_IDENTIFIERS.PLANET_SQUARE,
  createOpaqSquare(50, 50, '#330066', '#330066', 2, 0.3),
);
Engine._putAsset(
  ASSET_IDENTIFIERS.PLANET_SQUARE_ACTIVE,
  createSquare(50, 50, '#660066'),
);
Engine._putAsset(
  ASSET_IDENTIFIERS.PROBE_SQUARE,
  createOpaqSquare(50, 50, '#00cc99', '#00cc99', 2, 0.3),
);
Engine._putAsset(
  ASSET_IDENTIFIERS.PROBE_SQUARE_ACTIVE,
  createOpaqSquare(50, 50, '#e80000', '#e80000', 2, 0.3),
);
Engine._putAsset(
  ASSET_IDENTIFIERS.ENERGY,
  createSquare(100, 350, '#dd55aa'),
);
Engine._putAsset(
  ASSET_IDENTIFIERS.BACKGROUND,
  createSquare(960, 540, '#111111'),
);
Engine._putAsset(
  ASSET_IDENTIFIERS.PANEL,
  createOpaqSquare(130, 520, '#6600ff', '#6600ff', 2, 0.4),
);

Engine._putAsset(
  ASSET_IDENTIFIERS.LEVEL_SQUARE,
  createSquare(100, 100, '#660066'),
);

Engine._putAsset(
  ASSET_IDENTIFIERS.LEVEL_SQUARE_DONE,
  createSquare(100, 100, '#006666'),
);

Engine._putAsset(
  ASSET_IDENTIFIERS.LEVEL_SQUARE_ACTIVE,
  createSquare(100, 100, '#6600ff'),
);

Engine.globals = {
  won: 0,
  lost: 0,
  levels: [
    {
      width: 3,
      height: 3,
      planets: [
        {
          type: PLANET_TYPES.RED,
          x: 0,
          y: 1,
        }
      ],
      open: true,
      isTutorial: true,
      energyNotAffected: true
    }, {
      width: 4,
      height: 4,
      planets: [
        {
          type: PLANET_TYPES.RED,
        }, {
          type: PLANET_TYPES.RED,
        }
      ],
      open: false
    }, {
      width: 3,
      height: 3,
      planets: [
        {
          type: PLANET_TYPES.RED,
          x: 0,
          y: 1,
        }, {
          type: PLANET_TYPES.BLUE,
          x: 1,
          y: 1,
        }
      ],
      open: false,
      newPlanets: true,
      energyNotAffected: true
    }, {
      width: 6,
      height: 6,
      planets: [
        {
          type: PLANET_TYPES.RED,
        }, {
          type: PLANET_TYPES.RED,
        }, {
          type: PLANET_TYPES.GREEN,
        }, {
          type: PLANET_TYPES.BLUE,
        }
      ],
      open: false,
    }, {
      width: 4,
      height: 4,
      planets: [
        {
          type: PLANET_TYPES.SINGULARITY,
        }
      ],
      open: false,
      newSingularity: true,
      energyNotAffected: true,
    }, {
      width: 6,
      height: 6,
      planets: [
        {
          type: PLANET_TYPES.RED,
        }, {
          type: PLANET_TYPES.GREEN,
        }, {
          type: PLANET_TYPES.BLUE,
        }, {
          type: PLANET_TYPES.SINGULARITY,
        }
      ],
      open: false,
    }, {
      width: 4,
      height: 4,
      planets: [
        {
          type: PLANET_TYPES.CAT,
          x: 0,
          y: 1
        },{
          type: PLANET_TYPES.GREEN,
          x: 2,
          y: 2
        },
      ],
      open: false,
      newCat: true,
      energyNotAffected: true
    }, {
      width: 7,
      height: 7,
      planets: [
        {
          type: PLANET_TYPES.RED,
        },{
          type: PLANET_TYPES.RED,
        }, {
          type: PLANET_TYPES.GREEN,
        }, {
          type: PLANET_TYPES.BLUE,
        }, {
          type: PLANET_TYPES.CAT,
        }, {
          type: PLANET_TYPES.CAT,
        }
      ],
      open: false,
    }, {
      width: 4,
      height: 4,
      planets: [
        {
          type: PLANET_TYPES.SINGULARITY,
          x: 0,
          y: 1
        },{
          type: PLANET_TYPES.SINGULARITY,
          x: 2,
          y: 2
        },
      ],
      open: false,
      newWormhole: true,
      energyNotAffected: true
    }, {
      width: 7,
      height: 7,
      planets: [
        {
          type: PLANET_TYPES.RED,
        },{
          type: PLANET_TYPES.BLUE,
        }, {
          type: PLANET_TYPES.SINGULARITY,
        }, {
          type: PLANET_TYPES.SINGULARITY,
        }, {
          type: PLANET_TYPES.CAT,
        }, {
          type: PLANET_TYPES.CAT,
        }
      ],
      open: false,
    }, {
      width: 8,
      height: 7,
      planets: [
        {
          type: PLANET_TYPES.RED,
        },{
          type: PLANET_TYPES.RED,
        }, {
          type: PLANET_TYPES.BLUE,
        }, {
          type: PLANET_TYPES.BLUE,
        }, {
          type: PLANET_TYPES.GREEN,
        }, {
          type: PLANET_TYPES.GREEN,
        }, {
          type: PLANET_TYPES.CAT,
        }, {
          type: PLANET_TYPES.CAT,
        }
      ],
      open: false,
    }, {
      width: 9,
      height: 7,
      planets: [
        {
          type: PLANET_TYPES.RED,
        },{
          type: PLANET_TYPES.RED,
        }, {
          type: PLANET_TYPES.BLUE,
        }, {
          type: PLANET_TYPES.BLUE,
        }, {
          type: PLANET_TYPES.GREEN,
        }, {
          type: PLANET_TYPES.GREEN,
        }, {
          type: PLANET_TYPES.CAT,
        }, {
          type: PLANET_TYPES.CAT,
        }, {
          type: PLANET_TYPES.SINGULARITY,
        }, {
          type: PLANET_TYPES.SINGULARITY,
        }
      ],
      open: false,
    }
  ],
};

Engine.setScene(new MenuScene());
Engine.startScene();
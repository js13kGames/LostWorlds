import Scene from '../core/Scene';
import Engine from '../core/Engine';
import PlanetSquare from './objects/PlanetSquare';
import ProbeSquare from './objects/ProbeSquare';
import Background from './objects/Background';
import Panel from './objects/Panel';
import Beam from "./objects/Beam";
import Planet, {TYPES} from "./objects/Planet";
import Energy from "./objects/Energy";
import Button from '../core/Button';
import LevelScene from "../level/LevelScene";
import Scientist from "../menu/objects/Scientist";
import { IDENTIFIERS as ASSET_IDENTIFIERS } from '../core/Assets';
import Indicator from "../level/objects/Indicator";
import Renderable from "../core/Renderable";

const tutorialDialog = [
  "let's not waste any more time",
  "you have to place the particles from here",
  "to the blackbox",
  "you don't know where the 'red particle' is in the box",
  "but you can check it out using lasers here",
  "you see - particles are bending and influencing the laser beam",
  "lasers need power",
  "you can replace the battery whenever",
  "but this screws up current particle layout",
  "and you have to start your work from scratch",
  "don't worry about it in the tutorial level",
  "normaly, the beam will go in a straight line", // 10
  "unless there is a particle nearby", // 11
  "notice how the beam splits into two", // 12
  "that big beam goes into the blackbox", // 13
  "and is affected by particles in the box", // 14
  "smaller one goes above the box", // 15
  "and is affected by particles that you place on the box", // 16
  "i will place the 'red particle' where it belongs", // 17
  "as it bends the beam by 90 degrees at corner squares nearby", // 17
  "so the point here is to align those lasers together perfectly", // 18
  "if you shoot directly at a particle, beam will stop", // 19
  "and - if the particle is placed at the edge of the box", // 20
  "and you shoot neighboring lasers", // 21
  "the beam will return", // 22
  "you can play around here",
  "when you are finished - and particle placement is good",
  "click me and I will check your solution"
];

const newPlanetsDialog = [
  "in this box, there is a new type of particle",
  "a 'blue particle'",
  "you may also encounter a 'green' variety",
  "notice the laser discoloration"
];

const newSingularityDialog = [
  "i want to introduce you to a new particle type",
  "this here is a 'singularity'",
  "as in - small black hole",
  "your laser can get stuck in its event horizon"
];

const newCatDialog = [
  "this new particle",
  "is the 'schrodinger's bunny'",
  "i mean 'shrodinger's particle'!",
  "when you hit it",
  "it bends the beam in a different direction each time"
];

const newWormholeDialog = [
  "are you aware",
  "that two singularities",
  "create a wormhole for your laser?"
];

export const opositeDirection = (direction) => {
  if (direction === 'left') {
    return 'right';
  } else if (direction === 'right') {
    return 'left';
  } else if (direction === 'up') {
    return 'down';
  } else if (direction === 'down') {
    return 'up';
  }
};

export default class SpaceScene extends Scene {

  constructor(config, currentLevel) {
    super();
    this.currentLevel = currentLevel;
    this.check = this.check.bind(this);
    this.backToLevel = this.backToLevel.bind(this);
    this.checkSolution = this.checkSolution.bind(this);
    this.nextStep = this.nextStep.bind(this);
    this.restartLevel = this.restartLevel.bind(this);
    this.levelWon = this.levelWon.bind(this);
    this.disableTutorial = this.disableTutorial.bind(this);
    this.checkLimit = 3;

    this.laser = null;
    this.selectedPlanet = null;
    this.beam = null;
    this.fake = null;
    this.energyIndicator = new Energy(Engine.width - 125, 25, 100, 350, this.restartLevel);
    this.solutionButton = new Button(
      Engine.width - 120, Engine.height - 60, 90, 40,
      'solution', this.checkSolution
    );

    this.width = config.width;
    this.height = config.height;
    this.planets = config.planets;
    this.isTutorial = config.isTutorial;

    this.fakeDetermine = new Array(this.width);
    this.determine = new Array(this.width);

    this.probeSquares = new Array(this.width * 2 + this.height * 2);
    let currentProbeSquare = 0;
    this.planetSquares = new Array(this.width * this.height);
    let currentPlanetSquare = 0;

    this.objects = [];

    let i, j, obj;

    this.fakePlanets = new Array(this.planets.length);
    this.energyIndicator.setEnergy(1000 * this.planets.length);

    this.background = new Background(0, 0, Engine.width, Engine.height);
    this.leftPanel = new Panel(10, 10, 130, Engine.height - 20);
    this.objects.push(this.leftPanel);
    this.objects.push(new Panel(Engine.width - 140, 10, 130, Engine.height - 20));

    const widthPlanetSquares = 50 * this.width;
    const heightPlanetsSquare = 50 * this.height;

    this.limitX1 = Engine.width / 2 - widthPlanetSquares / 2;
    this.limitY1 = Engine.height / 2 - heightPlanetsSquare / 2;
    this.limitX2 = Engine.width / 2 + widthPlanetSquares / 2;
    this.limitY2 = Engine.height / 2 + heightPlanetsSquare / 2;

    for (i = 0; i < this.width; i += 1) {
      this.fakeDetermine[i] = new Array(this.height);
      this.determine[i] = new Array(this.height);

      for (j = 0; j < this.height; j += 1) {
        obj = new PlanetSquare(
          this.limitX1 + i * 50,
          this.limitY1 + j * 50,
          50, 50
        );
        obj.setId(i, j);
        this.objects.push(obj);
        this.planetSquares[currentPlanetSquare++] = obj;

        this.fakeDetermine[i][j] = null;
        this.determine[i][j] = null;
      }
    }

    this.fillDirections();

    for (i = 0; i < this.width; i += 1) {
      obj = new ProbeSquare(
        this.limitX1 + i * 50,
        this.limitY1 - 100,
        50, 50
      );
      this.probeSquares[currentProbeSquare++] = obj;

      obj = new ProbeSquare(
        this.limitX1 + i * 50,
        this.limitY2 + 50,
        50, 50
      );
      this.probeSquares[currentProbeSquare++] = obj;
    }

    for (i = 0; i < this.height; i += 1) {
      obj = new ProbeSquare(
        this.limitX1 - 100,
        this.limitY1 + i * 50,
        50, 50
      );
      this.probeSquares[currentProbeSquare++] = obj;

      obj = new ProbeSquare(
        this.limitX2 + 50,
        this.limitY1 + i * 50,
        50, 50
      );
      this.probeSquares[currentProbeSquare++] = obj;
    }

    for (i = 0; i < this.planets.length; i += 1) {
      const obj = new Planet(25 + i % 2 * 50, 25 + Math.floor(i / 2) * 65, 50, 50, this.planets[i].type);
      this.fakePlanets[i] = obj;
      this.objects.push(obj);
    }

    this.objects.push(this.energyIndicator);
    this.objects.push(this.solutionButton);

    let dialog = null;
    if (config.isTutorial) {
      dialog = tutorialDialog;
      this.skipTutorial = new Button(
        Engine.width - 120, Engine.height - 110, 90, 40,
        'skip tutorial', this.disableTutorial
      )
    } else if(config.newPlanets) {
      dialog = newPlanetsDialog;
    } else if (config.newSingularity) {
      dialog = newSingularityDialog;
    } else if (config.newCat) {
      dialog = newCatDialog;
    } else if (config.newWormhole) {
      dialog = newWormholeDialog;
    }

    this.scientist = new Scientist(80, Engine.height - 95, dialog, 4, 2);
    this.scientist.onClick(this.check);
    if (config.isTutorial) {
      this.scientist.setDialogStepCallback(this.nextStep);
    }

    this.energyNotAffected = config.energyNotAffected;

    this.indicator = [];

    this.middlePanel = new Renderable(this.limitX1, this.limitY1, widthPlanetSquares, heightPlanetsSquare);

    config.isTutorial = false;
    config.newPlanets = false;
    config.newSingularity = false;
    config.newWormhole = false;
    config.newCat = false;

    this.solutionMode = false;
  }

  disableTutorial() {
    this.skipTutorial = null;
    this.isTutorial = false;
    this.scientist.stopSpeach();
    this.indicator = [];
    this.deactivateLaser();
  }

  indicate(elements) {
    let i;
    this.indicator = [];
    for (i = 0; i < elements.length; i += 1) {
      this.indicator.push(new Indicator(elements[i]))
    }
  }

  nextStep(step) {
    if(step === 0) {
      this.indicate([this.leftPanel])
    } else if(step === 1) {
      this.indicate([this.middlePanel])
    } else if(step === 2) {
      this.indicate([this.fakePlanets[0]])
    } else if(step === 3) {
      this.indicate(this.probeSquares)
    } else if(step === 5) {
      this.indicate([this.energyIndicator])
    } else if(step === 10) {
      this.activateLaser(this.probeSquares[5]);
    } else if(step === 11 || step === 19) {
      this.deactivateLaser();
      this.activateLaser(this.probeSquares[3]);
    } else if(step === 13 || step === 14) {
      this.indicate([this.probeSquares[3], this.probeSquares[11]]);
      this.indicator[0].y -= 50;
      this.indicator[1].x -= 50;
    } else if(step === 15 || step === 16) {
      this.indicate([this.probeSquares[3]]);
      this.indicator[0].y -= 250;
      this.indicator[0].height = 250;
    } else if(step === 17) {
      this.deactivateLaser();
      this.selectPlanet(this.fakePlanets[0]);
      this.placePlanet(this.planetSquares[1]);
      this.indicate([this.planetSquares[1]])
    } else if(step === 18) {
      this.indicate([this.planetSquares[3], this.planetSquares[5]])
    } else if(step === 20) {
      this.indicator = [];
      this.deactivateLaser();
      this.activateLaser(this.probeSquares[8]);
    } else if(step === 21) {
      this.deactivateLaser();
      this.indicate([this.planetSquares[1]]);
    } else if(step === 22) {
      this.deactivateLaser();
      this.indicate([this.probeSquares[6], this.probeSquares[10]]);
      this.activateLaser(this.probeSquares[6]);
    } else if(step === 24) {
      this.deactivateLaser();
    }  else if(step > 26) {
      this.indicate([this.scientist]);
      this.isTutorial = false;
    } else {
      this.indicator = [];
    }
  }

  getPotentialLocation() {
    let potX = Math.floor(Math.random() * this.width);
    let potY = Math.floor(Math.random() * this.height);
    if (this.determine[potX][potY] !== null && this.determine[potX][potY].planet) {
      return this.getPotentialLocation();
    }
    return [potX, potY]
  }

  determineColorChange(from, to) {
    if (!from) {
      return to;
    } else {
      if (from === TYPES.BLUE || to === TYPES.BLUE) {
        return TYPES.BLUE;
      } else if (to === TYPES.GREEN || from === TYPES.GREEN) {
        return TYPES.GREEN;
      } else {
        return TYPES.RED;
      }
    }
  }

  addDirection(x, y, type, change, planet, fake = false) {
    if (x < 0 || y < 0 || x >= this.width || y >= this.height) {
      return;
    }

    let determineTable = this.determine;

    if (fake) {
      determineTable = this.fakeDetermine
    }

    let determineObject = determineTable[x][y];
    if (determineObject === null) {
      determineTable[x][y] = {};
      determineObject = determineTable[x][y];
    }

    if (determineObject[type] === 'stop') {
      return;
    }

    if (determineObject[type]) {
      if (determineObject[type] === opositeDirection(type)) {
        return;
      } else if (determineObject[type] === opositeDirection(change)){
        determineObject['change_' + type] = this.determineColorChange(
          determineObject['change_' + type], planet
        );
        determineObject[type] = opositeDirection(type);
      } else {
        determineObject['change_' + type] = this.determineColorChange(
          determineObject['change_' + type], planet
        );
        determineObject[type] = change;
      }
    } else {
      determineObject['change_' + type] = planet;
      determineObject[type] = change;
    }

    if (type === 'planet') {
      determineObject.left = 'stop';
      determineObject.change_left = planet;
      determineObject.right = 'stop';
      determineObject.change_right = planet;
      determineObject.up = 'stop';
      determineObject.change_up = planet;
      determineObject.down = 'stop';
      determineObject.change_down = planet;
    }
  }

  addPlanet(x, y, type, fake = false) {
    this.addDirection(x, y, 'planet', type, type, fake);

    if (type === TYPES.SINGULARITY) {
      this.addDirection(x - 1, y - 1, 'left', 'down', type, fake);
      this.addDirection(x - 1, y - 1, 'up', 'right', type, fake);
      this.addDirection(x + 1, y - 1, 'up', 'left', type, fake);
      this.addDirection(x + 1, y - 1, 'right', 'down', type, fake);
      this.addDirection(x - 1, y + 1, 'left', 'up', type, fake);
      this.addDirection(x - 1, y + 1, 'down', 'right', type, fake);
      this.addDirection(x + 1, y + 1, 'down', 'left', type, fake);
      this.addDirection(x + 1, y + 1, 'right', 'up', type, fake);
    } else if (type !== TYPES.CAT) {
      this.addDirection(x - 1, y - 1, 'right', 'up', type, fake);
      this.addDirection(x - 1, y - 1, 'down', 'left', type, fake);
      this.addDirection(x + 1, y - 1, 'down', 'right', type, fake);
      this.addDirection(x + 1, y - 1, 'left', 'up', type, fake);
      this.addDirection(x - 1, y + 1, 'right', 'down', type, fake);
      this.addDirection(x - 1, y + 1, 'up', 'left', type, fake);
      this.addDirection(x + 1, y + 1, 'up', 'right', type, fake);
      this.addDirection(x + 1, y + 1, 'left', 'down', type, fake);

      if (x === 0) {
        this.addDirection(x, y - 1, 'right', 'left', type, fake);
        this.addDirection(x, y + 1, 'right', 'left', type, fake);
      } else if (x === this.width -1) {
        this.addDirection(x, y - 1, 'left', 'right', type, fake);
        this.addDirection(x, y + 1, 'left', 'right', type, fake);
      }

      if (y === 0) {
        this.addDirection(x + 1, y, 'down', 'up', type, fake);
        this.addDirection(x - 1, y, 'down', 'up', type, fake);
      } else if (y === this.height -1) {
        this.addDirection(x + 1, y, 'up', 'down', type, fake);
        this.addDirection(x - 1, y, 'up', 'down', type, fake);
      }
    }
  }

  fillDirections() {
    let p;

    for (p = 0; p < this.planets.length; p += 1) {
      const planet = this.planets[p];
      if (planet.x === undefined) {
        const location = this.getPotentialLocation();
        planet.x = location[0];
        planet.y = location[1];
      }

      this.addPlanet(planet.x, planet.y, planet.type);
    }
  }

  zeroFakeDetermine() {
    var i,j;

    for (i = 0 ; i < this.width; i += 1) {
      for (j = 0 ; j < this.height; j += 1) {
        this.fakeDetermine[i][j] = null;
      }
    }
  }

  planetPlaced() {
    this.zeroFakeDetermine();

    let p;

    for (p = 0; p < this.fakePlanets.length; p += 1) {
      const planet = this.fakePlanets[p];
      if (planet.square) {
        this.addPlanet(planet.square.idX, planet.square.idY, this.planets[p].type, true);
      }
    }
  }

  getFromSquare(square) {
    let i;
    for (i = 0; i < this.planets.length; i += 1) {
      if (this.planets[i].x === square.idX && this.planets[i].y === square.idY) {
        return i;
      }
    }
  }

  getFakeFromSquare(square) {
    let i;
    for (i = 0; i < this.fakePlanets.length; i += 1) {
      if (this.fakePlanets[i].square.idX === square.idX &&
        this.fakePlanets[i].square.idY === square.idY) {
        return i;
      }
    }
  }

  getSingularityCount(fake) {
    let i;
    let sum = 0;
    for (i = 0; i < this.planets.length; i += 1) {
      if (this.planets[i].type === TYPES.SINGULARITY) {
        if ((fake && this.fakePlanets[i].square) || !fake) {
          sum += 1;
        }
      }
    }

    return sum;
  }

  getSecondSingularity(singularity) {
    let i;
    for (i = 0; i < this.planets.length; i += 1) {
      if (this.planets[i].type === TYPES.SINGULARITY &&
        (this.planets[i].x !== singularity.x || this.planets[i].y !== singularity.y)) {
        return this.planets[i];
      }
    }
  }

  getSecondFakeSingularity(singularity) {
    let i;
    for (i = 0; i < this.fakePlanets.length; i += 1) {
      if (this.fakePlanets[i].type === TYPES.SINGULARITY &&
        (this.fakePlanets[i].square.idX !== singularity.idX ||
          this.fakePlanets[i].square.idY !== singularity.idY)) {
        return this.fakePlanets[i].square;
      }
    }
  }

  deactivateLaser() {
    if (this.laser !== null) {
      this.laser.setState(ASSET_IDENTIFIERS.PROBE_SQUARE);
      this.laser = null;
      this.beam = null;
      this.fake = null;
    }
  }

  activateLaser(probeSquare) {
    this.laser = probeSquare;
    this.laser.setState(ASSET_IDENTIFIERS.PROBE_SQUARE_ACTIVE);
    this.beam = new Beam(this.limitX1, this.limitY1, this.limitX2, this.limitY2);
    this.beam.setProbe(probeSquare);
    this.beam.setScene(this);
    this.fake = new Beam(this.limitX1, this.limitY1, this.limitX2, this.limitY2);
    this.fake.setProbe(probeSquare);
    this.fake.setScene(this);
    this.fake.fakeIt();
  }

  selectPlanet(square) {
    if (this.selectedPlanet !== null) {
      this.selectedPlanet.setState(1)
    }

    if (this.selectedPlanet === square) {
      this.selectedPlanet = null;
    } else {
      this.selectedPlanet = square;
      this.selectedPlanet.setState(0);
    }
    return true;
  }

  placePlanet(square) {
    let recount = false;
    if (square.fake) {
      square.setFake(null);
      recount = true;
    }

    if (this.selectedPlanet) {
      square.setFake(this.selectedPlanet);
      this.selectedPlanet.setState(1);
      this.selectedPlanet = null;
      recount = true;
    }

    if (recount) {
      this.planetPlaced();
    }
  }

  determineDirection (x, y, direction, fake) {
    let directionTable = this.determine;
    if (fake) {
      directionTable = this.fakeDetermine;
    }
    const length = this.planetSquares.length;
    let square = null;
    let i;
    for (i = 0; i < length; i += 1) {
      square = this.planetSquares[i];
      if (square.inRange(x, y)) {
        break;
      }
    }

    const instruction = directionTable[square.idX][square.idY];

    if (instruction === null) {
      return [ direction, null ]
    }

    let returnDirection = instruction[direction] ? instruction[direction]: direction;

    let displacement = null;

    if (returnDirection === "stop" ) {
      // Get the cat
      if (instruction.planet === TYPES.CAT) {
        let cat;
        if (fake) {
          cat = this.fakePlanets[this.getFakeFromSquare(square)];
        } else {
          cat = this.fakePlanets[this.getFromSquare(square)];
        }
        returnDirection = cat.getDirectionForCat(direction, fake);
      } else if (instruction.planet === TYPES.SINGULARITY && this.getSingularityCount(fake) === 2){
        let s1, s2, id = this.getFromSquare(square);
        if (fake) {
          id = this.getFakeFromSquare(square);
          s1 = this.fakePlanets[id].square;
          s2 = this.getSecondFakeSingularity(s1);
          s2 = {
            x: s2.idX,
            y: s2.idY
          };
        } else {
          s1 = this.planets[id];
          s2 = this.getSecondSingularity(s1);
        }
        returnDirection = direction;
        displacement = [this.limitX1 + s2.x * 50 + 20, this.limitY1 + s2.y * 50 + 20];
      }
    }

    const colorChange = instruction['change_' + direction] ? instruction['change_' + direction] : null;

    return [returnDirection, colorChange, displacement];
  }

  pressed(x, y) {
    let i;

    if(this.scientist.pressed(x, y)) {
      return;
    }

    if (x > 160 && x < Engine.width - 160) {
      if (x > this.limitX1 && x < this.limitX2 && y > this.limitY1 && y < this.limitY2) {
        //Squares
        if (!this.solutionMode && !this.isTutorial) {
          const length = this.planetSquares.length;
          for (i = 0; i < length; i += 1) {
            const square = this.planetSquares[i];
            if (square.inRange(x, y)) {
              this.placePlanet(square);
              break;
            }
          }
        }

      } else {
        //Probes
        if (!this.isTutorial) {
          const length = this.probeSquares.length;
          for (i = 0; i < length; i += 1) {
            const square = this.probeSquares[i];
            if (square.inRange(x, y)) {
              this.activateLaser(square);
              break;
            }
          }
        }
      }
    } else {
      //Screens
      if (x < 160) {
        if (!this.solutionMode && !this.isTutorial) {
          const length = this.fakePlanets.length;
          for (i = 0; i < length; i += 1) {
            const square = this.fakePlanets[i];
            if (square.inRange(x, y)) {
              this.selectPlanet(square);
              break;
            }
          }
        }
      } else {
        if (!this.isTutorial) {
          this.solutionButton.pressed(x, y);
          this.energyIndicator.pressed(x, y);
        } else {
          this.skipTutorial.pressed(x, y);
        }
      }
    }
  }

  released () {
    if (!this.isTutorial) {
      this.deactivateLaser();
    }
  }

  moved(x, y) {
    this.scientist.moved(x, y);
    if(!this.isTutorial) {
      if (this.laser !== null && !this.laser.inRange(x, y)) {
        this.deactivateLaser();
      } else {
        this.solutionButton.moved(x, y);
      }
    } else {
      this.skipTutorial.moved(x, y);
    }
  }

  update() {
    let i;
    if (this.beam !== null) {
      this.beam.update();
      this.fake.update();
      if (!this.solutionMode) {
        this.energyIndicator.update();
      }

      if (this.energyIndicator.energy === 0 && !this.energyNotAffected && !this.solutionMode) {
        this.released();
      }
    }

    for (i = 0 ; i < this.indicator.length; i += 1) {
      this.indicator[i].update();
    }
    this.scientist.update();
  }

  displayScientistDialog(texts, callback) {
    this.scientist.say(texts, callback);
  }

  limitOK() {
    if (this.checkLimit > 0) {
      this.displayScientistDialog(
        [
          'not quite.',
          'You can ask me ' + this.checkLimit + ' more times before we go to lunch'
        ], null);
    } else {
      this.displayScientistDialog(
        [
          "not quite.",
          "well, let's take a break and go to lunch",
        ], this.backToLevel);
    }
  }

  check() {
    if(this.solutionMode) {
      this.displayScientistDialog(
        [
          "let's reset the box now",
          "so you can figure it out on your own this time"
        ], this.restartLevel);
    }

    var i, j;
    for (i = 0; i < this.width; i += 1) {
      for (j = 0 ; j < this.height; j += 1) {
        const real = this.determine[i][j];
        const fake = this.fakeDetermine[i][j];

        if (real !== null && real.planet) {
          if (fake !== null && fake.planet) {
            if (real.planet.type !== fake.planet.type) {
              this.checkLimit -= 1;
              this.limitOK();
              return;
            }
          } else {
            this.checkLimit -= 1;
            this.limitOK();
            return;
          }
        }
      }
    }

    this.displayScientistDialog(
      [
        'you did it!',
        'go ahead and try another blackbox then'
      ], this.levelWon);
  }

  resetPlanets() {
    let i;
    for (i = 0 ; i < this.planets.length; i += 1) {
      this.planets[i].x = undefined;
      this.planets[i].y = undefined;
    }
  }

  restartLevel() {
    this.resetPlanets();
    Engine.removeScene();
    Engine.setScene(new SpaceScene(Engine.globals.levels[this.currentLevel], this.currentLevel));
    Engine.startScene();
  }

  levelWon() {
    this.resetPlanets();

    if (this.currentLevel < Engine.globals.levels.length - 1) {
      const level = Engine.globals.levels[this.currentLevel + 1];
      if (!level.open) {
        level.open = true;
      }
    }
    Engine.globals.levels[this.currentLevel].done = true;
    this.backToLevel();
  }

  checkSolution() {
    this.fakeDetermine = this.determine;
    this.solutionMode = true;
    this.solutionButton.disabled();

    let i, j;

    const length = this.planetSquares.length;
    for (i = 0; i < length; i += 1) {
      const square = this.planetSquares[i];
      square.setFake(null);
    }

    for (i = 0 ; i < this.planets.length; i += 1) {
      let square;
      for (j = 0; j < length; j += 1) {
        square = this.planetSquares[j];
        if (square.idX === this.planets[i].x && square.idY === this.planets[i].y) {
          break;
        }
      }

      square.setFake(this.fakePlanets[i]);
    }

    this.planetPlaced();
  }

  backToLevel() {
    Engine.removeScene();
    Engine.setScene(new LevelScene());
    Engine.startScene();
  }

  render(context) {
    context.clearRect(0, 0, Engine.width, Engine.height);
    let i;
    let length = this.probeSquares.length;

    this.background.render(context);

    for (i = 0; i < length ; i += 1) {
      this.probeSquares[i].render(context);
    }

    if (this.beam !== null) {
      this.beam.render(context);
      context.fillStyle = "#111111";
      context.fillRect(this.limitX1, this.limitY1, this.width * 50, this.height * 50);
    }

    length = this.objects.length;

    for (i = 0; i < length ; i += 1) {
      this.objects[i].render(context);
    }

    if (this.beam !== null) {
      this.fake.render(context);
    }

    for (i = 0 ; i < this.indicator.length; i += 1) {
      this.indicator[i].render(context);
    }
    this.scientist.render(context);

    if (this.skipTutorial) {
      this.skipTutorial.render(context);
    }
  }


}
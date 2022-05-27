import {
  GAME_SIZE,
  CELL_STATES,
  DEFAULT_ALIVE_PAIRS,
  RENDER_INTERVAL
} from "./constants.js";

export class Model {
  constructor() {
    this.width = GAME_SIZE;
    this.height = GAME_SIZE;
    this.raf = null;
    this.observers = [];
  }

  init() {
    this.state = Array.from(new Array(this.height), () =>
      Array.from(new Array(this.width), () => CELL_STATES.NONE)
    );
    console.log(typeof(this.state))
    DEFAULT_ALIVE_PAIRS.forEach(([x, y]) => {
      this.state[y][x] = CELL_STATES.ALIVE;
    });
    this.updated();
  }

  run(date = new Date().getTime()) {
    this.raf = requestAnimationFrame(() => {
      const currentTime = new Date().getTime();
      if (currentTime - date > RENDER_INTERVAL) {

        this.temp_state = Array.from(new Array(this.height), () =>
          Array.from(new Array(this.width), () => CELL_STATES.NONE)
        );


        for (let i = 0; i < this.height; i++) {
          for (let j = 0; j < this.width; j++) {
            const nbAlive = this.aliveNeighbours(i, j);
            console.log({nbAlive, i, j})

            if (nbAlive === 3) {
              this.temp_state[j][i] = CELL_STATES.ALIVE;
            }


            if (this.state[j][i] === CELL_STATES.ALIVE ){
              if (nbAlive < 2 || nbAlive > 3){
                this.temp_state[j][i] = CELL_STATES.DEAD;
              }
              

              else {
                this.temp_state[j][i] = CELL_STATES.ALIVE
              }
              
              
            }

          

          }
        }

        this.state = this.temp_state
        this.updated();
        this.run(currentTime);
      } else {  
        this.run(date);
      }
    });
  }

  stop() {
    cancelAnimationFrame(this.raf);
    this.raf = null;
  }

  reset() {
    this.stop()
    this.init()
  }

  isCellAlive(x, y) {
    return x >= 0 &&
      y >= 0 &&
      y < this.height &&
      x < this.width &&
      this.state[y][x] === CELL_STATES.ALIVE
      ? 1
      : 0;
  }
  aliveNeighbours(x, y) {
    let number = 0;
    for (let i = x -1; i<= x+1; i++){
      for(let j = y -1; j<= y+1; j++){

        if (this.isCellAlive(i,j) && !(i===x && j===y)){
            number += 1;
          }
        }
        
    }

    return number;
  }

  updated() {
    for (const observer of this.observers){
      observer(this)
    }
  }

  add_observer(observer) {
    this.observers.push(observer)
  }
}

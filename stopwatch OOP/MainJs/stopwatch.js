import { rootDiv, storage } from "../Storage/Storage.js";
class Stopwatcher {
  tick = null;
  constructor({ id, millisec = 0, li = [], disabled = true, paused = true }) {
    this.id = id;
    this.time = new Date(millisec);
    this.millisec = millisec;
    this.li = li;
    this.disabled = disabled;
    this.paused = paused;
    this.timer = document.createElement("h2");
    this.lapsList = document.createElement("ul")
    this.stopwatchContainer = document.createElement("div")
    this.render();
  }

  makestructure() {
    const appElements = {
      stopwatchName: document.createElement("h1"),
      buttonContainer: document.createElement("div"),
      lapsListContainer: document.createElement("div"),
    };
    this.stopwatchContainer.classList.add(this.id, "stopwatchers");
    appElements.stopwatchName.textContent = "Секундомер";
    this.timer.textContent = this.convertedWatcher();
    appElements.lapsListContainer.className = "list";
    return appElements;
  }

  buttonsCreator() {
    const button = new Buttons(this);

    const buttons = {starter: button.startButton(),pauser: button.pauseButton(),reseter: button.resetButton(),lapper: button.lapButton(), stopwatcherDeleter : button.stopwatcherDelButton()};

    buttons.starter.addEventListener("click", () => {
      buttons.pauser.disabled = buttons.lapper.disabled = false;
      buttons.reseter.disabled = buttons.starter.disabled = true;
    });
    buttons.pauser.addEventListener("click", () => {
      buttons.pauser.disabled = buttons.lapper.disabled = true;
      buttons.reseter.disabled = buttons.starter.disabled = false;
    });
    return buttons
  }

  render() {

    const {stopwatchName,buttonContainer,lapsListContainer,} = this.makestructure();
    const { starter, pauser, reseter, lapper, stopwatcherDeleter } = this.buttonsCreator();

    rootDiv.append(this.stopwatchContainer);
    this.stopwatchContainer.append( stopwatcherDeleter,stopwatchName, this.timer, buttonContainer, lapsListContainer);
    this.li.forEach((time) => {this.lapsList.prepend(this.listElementGenerator(time));});
    buttonContainer.append(starter, pauser, reseter, lapper);
    lapsListContainer.append(this.lapsList);
  }

  listElementGenerator(time) {
    const listLi = document.createElement("li");
    listLi.textContent = `${time}`;
    const liDel = document.createElement("button");
    liDel.textContent = "x";
    liDel.addEventListener("click", (event) => {
      event.target.remove();
      listLi.remove();
      this.li = this.li.filter((listElementContent) => listElementContent != listLi.textContent);
      this.localStorageSetter();
    });
    listLi.append(liDel);
    return listLi;
  }

  convertedWatcher() {
    const curMili = this.time.getMilliseconds();
    return `
		 ${this.time.toLocaleTimeString('en-GB', {timeZone : 'UTC'})}:${("0" + curMili).slice(-3, -1) < 10? ("00" + curMili).slice(-3, -1) : String(curMili).slice(-3, -1)}`;
  }

  localStorageSetter() {
    storage[this.id] = this;
    localStorage.setItem("dataStore", JSON.stringify(storage));
  }
}
class Buttons  {
  constructor(stopwatcherSource) {
    this.stopwatcherSource = stopwatcherSource
  }

  stopwatcherDelButton(){
    const deleterButton = document.createElement("button");
    deleterButton.textContent = "удалить секундомер";
    deleterButton.addEventListener("click", () => {
      clearInterval(this.stopwatcherSource.tick);
      delete storage[this.stopwatcherSource.id];
      localStorage.setItem("dataStore", JSON.stringify(storage));
      this.stopwatcherSource.stopwatchContainer.remove();
    })
    return deleterButton
  }

  timerRun() {
    return (this.stopwatcherSource.tick = setInterval(() => {
      this.stopwatcherSource.millisec += 10;
      this.stopwatcherSource.time = new Date(this.stopwatcherSource.millisec);
      this.stopwatcherSource.timer.textContent = this.stopwatcherSource.convertedWatcher();
      this.stopwatcherSource.localStorageSetter();
    }, 10));
  }

  startButton() {
    const tostart = document.createElement("button");
    tostart.className = "startButton";
    tostart.textContent = "start";
    tostart.disabled = !this.stopwatcherSource.disabled;
    tostart.addEventListener("click", () => {
      clearInterval(this.stopwatcherSource.tick);
      this.stopwatcherSource.paused = !this.stopwatcherSource.paused;
      this.stopwatcherSource.disabled = !this.stopwatcherSource.disabled;
      this.timerRun();
    });
    !this.stopwatcherSource.paused ? this.timerRun() : null;
    return tostart;
  }

  pauseButton() {
    const pause = document.createElement("button");
    pause.className = "pauseButton";
    pause.textContent = "pause";
    pause.disabled = this.stopwatcherSource.disabled;
    pause.addEventListener("click", () => {
      clearInterval(this.stopwatcherSource.tick);
      this.stopwatcherSource.paused = !this.stopwatcherSource.paused;
      this.stopwatcherSource.disabled = !this.stopwatcherSource.disabled;
      this.stopwatcherSource.localStorageSetter();
    });
    return pause;
  }

  resetButton( ) {
    const reset = document.createElement("button");
    reset.className = "resetButton";
    reset.textContent = "reset";
    reset.disabled = !this.stopwatcherSource.disabled;
    reset.addEventListener("click", () => {
      this.stopwatcherSource.lapsList.innerHTML = "";
      this.stopwatcherSource.li = [];
      this.stopwatcherSource.millisec = 0;
      this.stopwatcherSource.time = new Date(this.stopwatcherSource.millisec);
      this.stopwatcherSource.timer.textContent = this.stopwatcherSource.convertedWatcher();
      this.stopwatcherSource.localStorageSetter();
    });
    return reset;
  }

  lapButton( ) {
    const lap = document.createElement("button");
    lap.className = "lapButton";
    lap.textContent = "lap";
    lap.disabled = this.stopwatcherSource.disabled;
    lap.addEventListener("click", () => {
      this.stopwatcherSource.li.push(this.stopwatcherSource.timer.textContent);
      this.stopwatcherSource.lapsList.prepend(this.stopwatcherSource.listElementGenerator(this.stopwatcherSource.timer.textContent));
      this.stopwatcherSource.localStorageSetter();
    });
    return lap;
  }
}


Object.values(storage).forEach((stopwachers) => new Stopwatcher(stopwachers));
const creator = document.createElement("div");
const creatorButton = document.createElement("button");
creatorButton.textContent = "создать секундомер";
creatorButton.addEventListener("click", () => {
  const a = new Stopwatcher({
    id:
      ((Object.values(storage)[Object.values(storage).length - 1] || 0).id ||
        0) + 1,
  });
  a.localStorageSetter();
});
rootDiv.before(creator);
creator.append(creatorButton);

import {circleBtn, masterElem, pauseBtn, resetBtn, startBtn, rootUl} from "./storage/storage.js";
let mili = 0;
let timer, forLaps;
function converter(data) {
  return data < 10? ("0" + data).slice(0, 2) : data;
}
function start() {
  clearInterval(timer);
  pauseBtn.disabled = circleBtn.disabled = false;
  resetBtn.disabled = startBtn.disabled = true;
  timer = setInterval(() => {
    mili += 10;
    const time = new Date(mili);
    forLaps = time.getMilliseconds() === 0? "00" + time.getMilliseconds():  time.getMilliseconds() <100?  "0" + time.getMilliseconds() : time.getMilliseconds();
    masterElem.textContent = `
    ${converter(time.getUTCHours())}:${converter(time.getMinutes())}:${converter(time.getSeconds())}:${('0'+time.getMilliseconds()).slice(-3,-1)<10?('00'+time.getMilliseconds()).slice(-3,-1) : String(time.getMilliseconds()).slice(-3,-1)}
    `}
    , 10);
}
function pause() {
  clearInterval(timer);
  resetBtn.disabled = startBtn.disabled = false;
  pauseBtn.disabled = circleBtn.disabled = true;
}
function reset() {
  clearInterval(timer);
  mili = 0;
  masterElem.textContent = "00:00:00:00";
  rootUl.innerHTML = "";
}
function toList() {
  rootUl.innerHTML = `<li> ${rootUl.children.length + 1}) ${masterElem.outerText.slice(0,9)}${forLaps} </li>` + rootUl.innerHTML;
}
document.querySelector(".startbtn").addEventListener("click", () => start());
document.querySelector(".pausebtn").addEventListener("click", () => pause());
document.querySelector(".resetbtn").addEventListener("click", () => reset());
document.querySelector(".circlebtn").addEventListener("click", () => toList());

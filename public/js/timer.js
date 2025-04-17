// Credits to: https://codepen.io/JayblesG/pen/zYWOyqY
var display = document.getElementById("time-display");
var display_margin = 1;
var pixel_width = 20;
var background = "#222";
var foreground = "#c00";
var show_ampm = false;

var timerTime = 90;

var numbers = {
  ":": { map: ["0", "1", "0", "1", "0"] },
  "0": { map: ["111", "101", "101", "101", "111"] },
  "1": { map: ["110", "010", "010", "010", "111"] },
  "2": { map: ["111", "001", "111", "100", "111"] },
  "3": { map: ["111", "001", "111", "001", "111"] },
  "4": { map: ["101", "101", "111", "001", "001"] },
  "5": { map: ["111", "100", "111", "001", "111"] },
  "6": { map: ["111", "100", "111", "101", "111"] },
  "7": { map: ["111", "001", "001", "001", "001"] },
  "8": { map: ["111", "101", "111", "101", "111"] },
  "9": { map: ["111", "101", "111", "001", "001"] }
};

if (show_ampm) {
  numbers.P = { map: ["0000", "0111", "0101", "0111", "0101"] };
  numbers.A = { map: ["0000", "0111", "0101", "0111", "0100"] };
  numbers.M = { map: ["00000", "11111", "10101", "10101", "10101"] };
}

var blink = false;
var last_width = 0;
var height_pixels = 10 + display_margin * 2;

// window.onload = function () {
//   display.style.height = pixel_width * height_pixels + "px";

//   const seconds = parseInt(timerTime);
//   if (!isNaN(seconds) && seconds > 0) {
//     StartTimer(seconds);
//   }
// };

function ShowTime() {
  let minutes = Math.floor(remainingTime / 60);
  let seconds = remainingTime % 60;
  let text = `${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
  SetText(text);
}

let countdownInterval;
let remainingTime;

function StartTimer(seconds) {
  remainingTime = seconds;
  ShowTime();
  clearInterval(countdownInterval);
  countdownInterval = setInterval(function () {
    remainingTime--;
    if (remainingTime <= 0) {
      clearInterval(countdownInterval);
      remainingTime = 0;
    }
    ShowTime();
  }, 1000);
}

function SetText(text) {
  var width_pixels = display_margin * 2;
  blink = !blink;

  for (var x = 0; x < text.length; x++) {
    if (numbers[text[x]] === undefined) continue;
    width_pixels += numbers[text[x]].map[0].length * 2 + 1;
  }

  width_pixels -= 1;

  if (width_pixels != last_width) {
    display.innerHTML = "";
    display.style.width = pixel_width * width_pixels + "px";

    for (var h = 0; h < height_pixels; h++) {
      for (var w = 0; w < width_pixels; w++) {
        var x = pixel_width * w;
        var y = pixel_width * h;

        var div = document.createElement("div");
        div.id = `pixel${h + 1}x${w + 1}`;
        div.setAttribute("row", h + 1);
        div.setAttribute("col", w + 1);
        div.className = "pixel margin";
        div.style.top = y + "px";
        div.style.left = x + "px";
        div.style.width = pixel_width + "px";
        div.style.height = pixel_width + "px";

        var img = document.createElement("img");
        img.className = "peg";
        img.src = "https://i.ibb.co/x3bwfQ5/brick.png";
        img.style.width = pixel_width + "px";
        img.style.height = pixel_width + "px";

        div.appendChild(img);
        display.appendChild(div);
      }
    }
  }

  var cRow = display_margin + 1;
  var cCol = display_margin + 1;

  for (var x = 0; x < text.length; x++) {
    var tRow = cRow;
    var tCol = cCol;
    if (numbers[text[x]] === undefined) continue;
    var number = numbers[text[x]];

    for (var r = 0; r < number.map.length; r++) {
      for (var l = 0; l < number.map[r].length; l++) {
        var letter = number.map[r][l];
        var pixel = document.querySelectorAll(
          `#pixel${tRow}x${tCol}, #pixel${tRow + 1}x${tCol}, #pixel${tRow}x${tCol + 1}, #pixel${tRow + 1}x${tCol + 1}`
        );

        pixel.forEach(function (p) {
          p.style.background = letter == "1" ? foreground : background;
          p.classList.remove("margin");
        });

        if (blink && numbers[text[x]].blink !== undefined) letter = "0";

        if (l == number.map[r].length - 1) {
          tCol = cCol;
          tRow += 2;
        } else {
          tCol += 2;
        }
      }
    }

    cCol += number.map[0].length * 2 + 1;
  }

  document.querySelectorAll(".pixel.margin").forEach(function (p) {
    p.style.background = background;
  });
}

function GetTime() {
  return remainingTime;
}

function PauseTimer() {
  clearInterval(countdownInterval);
}
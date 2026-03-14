document.addEventListener("DOMContentLoaded", () => {
  let timer = null;
  let timeLeft = 180;
  let gameEnded = false;

  const game = document.getElementById("game");
  const ending = document.getElementById("ending");
  const restartBtn = document.getElementById("restartBtn");
  const timerDisplay = document.getElementById("timer");

  restartBtn.addEventListener("click", () => {
    window.history.back();
  });

  const params = new URLSearchParams(window.location.search);
  const filePath = params.get("filePath");

  if (!filePath) {
    showToast("filePath 쿼리 파라미터가 없습니다.");
    return;
  }

  startLevel(filePath);

  function startLevel(filePath) {
    gameEnded = false;

    loadStage(filePath);

    clearInterval(timer);
    timeLeft = 60 * 1;
    updateTimer();
    startTimer();
  }

  function loadStage(filePath) {
    const leftSvg = document.getElementById("leftSvg");
    const rightSvg = document.getElementById("rightSvg");

    const leftImage = leftSvg.querySelector("image");
    const rightImage = rightSvg.querySelector("image");

    // 왼쪽/오른쪽 이미지는 static/img에서 가져온다.
    leftImage.setAttribute("xlink:href", `../static/img/${filePath}`);
    const rightFile = filePath.replace(/-L(\.[^.]+)$/, "-R$1");
    rightImage.setAttribute("xlink:href", `../static/img/${rightFile}`);

    const leftShapeGroup = leftSvg.querySelector(".shapeGroup");
    const rightShapeGroup = rightSvg.querySelector(".shapeGroup");
    const leftCircleGroup = leftSvg.querySelector(".circleGroup");
    const rightCircleGroup = rightSvg.querySelector(".circleGroup");

    leftShapeGroup.innerHTML = "";
    rightShapeGroup.innerHTML = "";
    leftCircleGroup.innerHTML = "";
    rightCircleGroup.innerHTML = "";

    // 도형 그룹은 static/xml 에 있는 SVG에서 읽어온다.
    // 예) filePath: "ttukboki-L.jpg" -> xml: "ttukboki.xml"
    const baseForXml = filePath.includes("-L.")
      ? filePath.replace(/-L\.[^.]+$/, "")
      : filePath.replace(/\.[^.]+$/, "");
    const xmlPath = `../static/xml/${baseForXml}.xml`;

    fetch(xmlPath)
      .then((res) => res.text())
      .then((svgText) => {
        const parser = new DOMParser();
        const doc = parser.parseFromString(svgText, "image/svg+xml");
        const svgEl = doc.querySelector("svg");
        console.log(svgEl);

        let shapesEl = Array.from(svgEl.querySelectorAll('g[id="레이어_3"] > *'));
        if (!shapesEl.length) shapesEl = Array.from(svgEl.querySelectorAll("svg > *"));
        if (shapesEl[0]?.tagName.toLowerCase() === "image") shapesEl = shapesEl.slice(1);

        const shapesHtmlString = shapesEl.map((el) => el.outerHTML).join("");
        leftShapeGroup.innerHTML = shapesHtmlString;
        rightShapeGroup.innerHTML = shapesHtmlString;

        initGame([leftSvg, rightSvg]);
      })
      .catch(() => {
        showToast("도형 XML을 불러오지 못했습니다.");
      });
  }

  function initGame(svgs) {
    svgs.forEach((svg) => {
      const newSvg = svg.cloneNode(true);
      svg.parentNode.replaceChild(newSvg, svg);
    });

    const leftSvg = document.getElementById("leftSvg");
    const rightSvg = document.getElementById("rightSvg");

    const answers = Array.from(leftSvg.querySelectorAll(".shapeGroup > *"));
    const answersCount = answers.length;

    const foundSet = new Set();
    const busySet = new Set();

    answers.forEach((shape, idx) => {
      [leftSvg, rightSvg].forEach((svg) => {
        const s = svg.querySelectorAll(".shapeGroup > *")[idx];
        if (!s) return;
        s.style.fill = "transparent";
        s.style.stroke = "none";
        s.style.pointerEvents = "all";
        s.dataset.id = idx;
      });
    });

    function handleClick(e) {
      if (gameEnded) return;

      const id = e.target?.dataset?.id;

      if (id === undefined) {
        applyPenalty();
        return;
      }

      if (foundSet.has(id) || busySet.has(id)) return;
      busySet.add(id);
      foundSet.add(id);

      const point = getSvgPoint(e.currentTarget, e);

      [leftSvg, rightSvg].forEach((svg) => {
        const shape = svg.querySelector(`[data-id="${id}"]`);
        if (shape) shape.style.pointerEvents = "none";

        drawCircle(svg, point.x, point.y);
      });

      busySet.delete(id);

      if (foundSet.size === answersCount) {
        setTimeout(() => {
          showToast("🎯 스테이지 클리어!");
        }, 500);
        setTimeout(() => {
          gameEnded = true;
          clearInterval(timer);
          showEnding("clear");
        }, 2000);
      }
    }

    [leftSvg, rightSvg].forEach((svg) =>
      svg.addEventListener("click", handleClick)
    );
  }

  function applyPenalty() {
    timeLeft = Math.max(0, timeLeft - 10);
    flashTimerRed();
    updateTimer();
    if (timeLeft <= 0) {
      clearInterval(timer);
      if (!gameEnded) showEnding("timeout");
    }
  }

  function startTimer() {
    timer = setInterval(() => {
      if (timeLeft <= 0) {
        clearInterval(timer);
        if (!gameEnded) showEnding("timeout");
        return;
      }
      timeLeft--;
      updateTimer();
    }, 1000);
  }

  function updateTimer() {
    const m = Math.floor(timeLeft / 60);
    const s = String(timeLeft % 60).padStart(2, "0");
    timerDisplay.textContent = `⏱ ${m}:${s}`;
  }

  function flashTimerRed() {
    timerDisplay.classList.add("flash");
    setTimeout(() => timerDisplay.classList.remove("flash"), 500);
  }

  function showEnding(reason) {
    gameEnded = true;
    game.style.display = "none";
    ending.style.display = "block";

    const h1 = ending.querySelector("h1");
    const p = ending.querySelector("p");

    if (reason === "timeout") {
      h1.textContent = "⏰ 시간 종료!";
      p.textContent = "아쉽네요. 다음엔 더 빠르게 찾아보세요!";
    } else {
      h1.textContent = "🎉 모든 스테이지 클리어!";
      p.textContent = "축하합니다! 완벽한 관찰력이네요!";
    }
  }

  function getSvgPoint(svg, event) {
    const point = svg.createSVGPoint();
    point.x = event.clientX;
    point.y = event.clientY;
    return point.matrixTransform(svg.getScreenCTM().inverse());
  }

  function drawCircle(svg, x, y) {
    const circle = document.createElementNS("http://www.w3.org/2000/svg", "circle");
    circle.setAttribute("cx", x);
    circle.setAttribute("cy", y);
    circle.setAttribute("r", 100);
    circle.setAttribute("stroke", "red");
    circle.setAttribute("stroke-width", 20);
    circle.setAttribute("fill", "none");

    svg.querySelector(".circleGroup").appendChild(circle);
  }

  function showToast(message) {
    const toast = document.getElementById("toast");
    toast.textContent = message;
    toast.classList.add("show");

    setTimeout(() => {
      toast.classList.remove("show");
    }, 2000);
  }

  updateTimer();
});


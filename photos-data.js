const PHOTOS = [
  {
    filePath: "ttukboki-L.jpg",
    artist: "me",
    title: "떠억",
    text: "하니",
    tags: ["food", "red"],
    earliestDate: "2025-10-25",
    camera: "Samsung Galaxy S24",
    materials: ["5.4mm", "F1.8", "1/60s", "ISO160", "0.0ev"],
    dimensons: "4000 x 2252",
    easterEgg: true
  },
  {
    filePath: "photo1.JPG",
    artist: "미",
    title: "딸기",
    text: "겨울 딸기를 다듬은 모습이다.",
    tags: ["food", "red"],
    earliestDate: "2025-12-23",
    camera: "SAMSUNG NX10",
    materials: ["54mm", "F4.3", "1/15s", "ISO400", "0.0ev"],
    dimensons: "1280x1920"
  },
  {
    filePath: "photo2.JPG",
    artist: "미",
    title: "연어",
    text: "겨울 연어를 다듬은 모습이다.",
    tags: ["food", "red"],
    earliestDate: "2025-12-23",
    camera: "SAMSUNG NX10",
    materials: ["54mm", "F4.3", "1/15s", "ISO400", "0.0ev"],
    dimensons: "1280x1920"
  },
  {
    filePath: "image1.png",
    artist: "미",
    title: "엽기",
    text: "떡볶이",
    tags: ["food", "red"],
    earliestDate: "2022-01-22",
    camera: "Illustrator",
    materials: ["떡", "어묵", "치즈", "파"],
    dimensons: "1366 x 768"
  },
  {
    filePath: "1771778323906-RUID2cd85be079e34b49b85900cb835ddb8b.JPG",
    artist: "미",
    title: "초짜야 초짜야",
    text: "뒤를 돌아라",
    tags: ["landscape", "snow"],
    earliestDate: "2026-01-25",
    camera: "SAMSUNG NX10",
    materials: ["59mm", "F4.3", "1/200s", "ISO320", "0.0ev"],
    dimensons: "1280 x 1920"
  },
  {
    filePath: "1771778466072-RUIDcff1b0627e3b485a911d04e71c87b871.JPG",
    artist: "미",
    title: "일십백천",
    text: "만십만백만",
    tags: ["landscape", "water", "snow"],
    earliestDate: "2026-01-25",
    camera: "SAMSUNG NX10",
    materials: ["89mm", "F11", "1/800s", "ISO3200", "0.0ev"],
    dimensons: "1280 x 1920"
  },
  {
    filePath: "1771778661417-RUIDb4dda0a53f594cae8c58958ac204a57c.JPG",
    artist: "미",
    title: "암암",
    text: "어둔걸 어둡게 찍어야지",
    tags: ["dark"],
    earliestDate: "2026-01-25",
    camera: "SAMSUNG NX10",
    materials: ["54mm", "F4.3", "1/320s", "ISO200", "0.0ev"],
    dimensons: "1920 x 1280"
  },
  {
    filePath: "1771778917257-RUIDdbe04238747b4a88bbaca2d17dc13f66.JPG",
    artist: "미",
    title: "고난",
    text: "이도",
    tags: ["landscape"],
    earliestDate: "2026-01-25",
    camera: "SAMSUNG NX10",
    materials: ["59mm", "F5", "1/100s", "ISO100", "0.0ev"],
    dimensons: "3056 x 4592"
  },
  {
    filePath: "1771779095753-RUIDca238a46d8b14496aaf6530de0c8e753.JPG",
    artist: "미",
    title: "크리쓰리",
    text: "마트리",
    tags: ["winter"],
    earliestDate: "2026-01-25",
    camera: "SAMSUNG NX10",
    materials: ["50mm", "F6.7", "1/400s", "ISO800", "-0.3ev"],
    dimensons: "1280 x 1920"
  },
  {
    filePath: "1773321989309-Ã¬ÂÂÃ¬ÂÂ¥2.png",
    artist: "미",
    title: "Market",
    text: "In Dream",
    tags: ["dark", "night", "dream"],
    earliestDate: "2022-01-22",
    camera: "그림판",
    materials: ["부러쉬"],
    dimensons: "1920 x 1030"
  }
];

const HYPES = PHOTOS.filter((p) =>
  [
    "photo1.JPG",
    "photo2.JPG",
    "ttukboki-L.jpg",
  ].includes(p.filePath)
);
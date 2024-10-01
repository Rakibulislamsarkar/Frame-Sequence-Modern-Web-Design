const canvas = document.querySelector("canvas");
const context = canvas.getContext("2d");
const frames = {
  currentIndex: 0,
  maxIndex: 1345,
};
const images = [];
let imagesLoaded = 0;

// Preload images
function preloadImages() {
  for (var i = 1; i <= frames.maxIndex; i++) {
    const imageUrl = `./dzo/frame_${i.toString().padStart(4, "0")}.png`;
    const img = new Image();
    img.src = imageUrl;

    img.onload = function () {
      imagesLoaded++;
      if (imagesLoaded == frames.maxIndex) {
        loadImage(frames.currentIndex);
        startAnimation();
      }
    };
    images.push(img);
  }
}
preloadImages();

// Load the image on canvas
function loadImage(index) {
  if (index >= 0 && index <= frames.maxIndex) {
    const img = images[index];
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const scaleX = canvas.width / img.width;
    const scaleY = canvas.height / img.height;
    const scale = Math.max(scaleX, scaleY);

    const newWidth = img.width * scale;
    const newHeight = img.height * scale;

    const offsetX = (canvas.width - newWidth) / 2;
    const offsetY = (canvas.height - newHeight) / 2;

    context.clearRect(0, 0, canvas.width, canvas.height);
    context.imageSmoothingEnabled = true;
    context.imageSmoothingQuality = "high";
    context.drawImage(img, offsetX, offsetY, newWidth, newHeight);

    frames.currentIndex = index;
  }
}

function startAnimation() {
  // Define timeline with ScrollTrigger
  var tl = gsap.timeline({
    scrollTrigger: {
      trigger: ".parent",
      start: "top top",
      end: "bottom bottom",
      scrub: 2,
    },
  });
  
  // Animation for updating frames
  function updateFrame(targetFrame) {
    return {
      currentIndex: targetFrame, // Animate to target frame
      ease: "linear",
      onUpdate: () => {
        loadImage(Math.floor(frames.currentIndex)); // Update image on canvas
      },
    };
  }

  const halfwayPoint = frames.maxIndex / 2;

  // Simultaneous fade-out of animate1 and fade-in of animate2
  tl.to(frames, { ...updateFrame(halfwayPoint), duration: 1 }, "start") // Animate frames to halfway
    .to(".animate1", { opacity: 0, duration: 1, ease: "linear" }, "start") // Fade out .animate1 at halfway
    .to(".animate2", { opacity: 1, duration: 1, ease: "linear" }, "start"); // Fade in .animate2 simultaneously
  tl.to(frames, { ...updateFrame(frames.maxIndex), duration: 1 }, "halfway"); // Continue animating frames till the end
}

// Ensure the canvas resizes correctly
window.addEventListener("resize", () => {
  loadImage(Math.floor(frames.currentIndex));
});
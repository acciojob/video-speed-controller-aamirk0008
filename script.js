const inputs = document.querySelectorAll('.controls input');

    function handleUpdate() {
      const suffix = this.dataset.sizing || '';
      document.documentElement.style.setProperty(`--${this.name}`, this.value + suffix);
    }

    inputs.forEach(input => input.addEventListener('change', handleUpdate));
    inputs.forEach(input => input.addEventListener('mousemove', handleUpdate));
const player = document.querySelector(".player");
      const video = player.querySelector(".viewer");
      const progress = player.querySelector(".progress");
      const progressBar = player.querySelector(".progress__filled");
      const toggle = player.querySelector(".toggle");
      const skipButtons = player.querySelectorAll("[data-skip]");
      const ranges = player.querySelectorAll(".player__slider");
      const currentTimeDisplay = player.querySelector(".current-time");
      const totalTimeDisplay = player.querySelector(".total-time");
      const speedDisplay = player.querySelector(".speed-display");

      // Build out functions
      function togglePlay() {
        const method = video.paused ? "play" : "pause";
        video[method]();
      }

      function updateButton() {
        const icon = video.paused ? "►" : "❚ ❚";
        toggle.textContent = icon;
      }

      function skip() {
        video.currentTime += parseFloat(this.dataset.skip);
      }

      function handleRangeUpdate() {
        video[this.name] = this.value;

        if (this.name === "playbackSpeed") {
          speedDisplay.textContent = `${parseFloat(this.value).toFixed(1)}×`;
        }
      }

      function handleProgress() {
        const percent = (video.currentTime / video.duration) * 100;
        progressBar.style.width = `${percent}%`;

        // Update time display
        currentTimeDisplay.textContent = formatTime(video.currentTime);
      }

      function scrub(e) {
        const scrubTime = (e.offsetX / progress.offsetWidth) * video.duration;
        video.currentTime = scrubTime;
      }

      function formatTime(seconds) {
        const mins = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60);
        return `${mins}:${secs < 10 ? "0" : ""}${secs}`;
      }

      function handleLoadedMetadata() {
        totalTimeDisplay.textContent = formatTime(video.duration);
      }

      // Hook up the event listeners
      video.addEventListener("click", togglePlay);
      video.addEventListener("play", updateButton);
      video.addEventListener("pause", updateButton);
      video.addEventListener("timeupdate", handleProgress);
      video.addEventListener("loadedmetadata", handleLoadedMetadata);

      toggle.addEventListener("click", togglePlay);
      skipButtons.forEach((button) => button.addEventListener("click", skip));
      ranges.forEach((range) =>
        range.addEventListener("change", handleRangeUpdate)
      );
      ranges.forEach((range) =>
        range.addEventListener("mousemove", handleRangeUpdate)
      );

      let mousedown = false;
      progress.addEventListener("click", scrub);
      progress.addEventListener("mousemove", (e) => mousedown && scrub(e));
      progress.addEventListener("mousedown", () => (mousedown = true));
      progress.addEventListener("mouseup", () => (mousedown = false));

      // Initialize speed display
      speedDisplay.textContent = "1.0×";

      // Auto-hide controls
      let controlsTimeout;

      player.addEventListener("mouseenter", () => {
        clearTimeout(controlsTimeout);
      });

      player.addEventListener("mouseleave", () => {
        controlsTimeout = setTimeout(() => {
          // Controls will be hidden by CSS
        }, 3000);
      });

      // Keyboard shortcuts
      document.addEventListener("keydown", (e) => {
        if (e.target.tagName.toLowerCase() !== "input") {
          switch (e.code) {
            case "Space":
              e.preventDefault();
              togglePlay();
              break;
            case "ArrowLeft":
              e.preventDefault();
              video.currentTime -= 10;
              break;
            case "ArrowRight":
              e.preventDefault();
              video.currentTime += 25;
              break;
            case "ArrowUp":
              e.preventDefault();
              video.volume = Math.min(1, video.volume + 0.1);
              ranges[0].value = video.volume;
              break;
            case "ArrowDown":
              e.preventDefault();
              video.volume = Math.max(0, video.volume - 0.1);
              ranges[0].value = video.volume;
              break;
          }
        }
      });

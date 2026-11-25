(() => {
  const target = Date.parse("2026-12-16T00:00:00+08:00");
  const manilaOffset = 8 * 60 * 60 * 1000;
  const fields = ["months", "days", "hours", "minutes", "seconds"];
  const nodes = fields.map((id) => document.getElementById(id));
  const clock = document.querySelector(".clock");
  const soundButton = document.getElementById("sound-toggle");
  const clockAudio = new Audio("clock-tick.mp3");
  clockAudio.loop = true;
  clockAudio.preload = "none";

  function setSoundState(enabled) {
    soundButton.title = enabled ? "Sound on" : "Sound off";
    soundButton.setAttribute("aria-label", "Sound");
    soundButton.setAttribute("aria-pressed", String(enabled));
  }

  soundButton.addEventListener("click", async () => {
    if (Date.now() >= target) return;
    if (!clockAudio.paused) {
      clockAudio.pause();
      setSoundState(false);
      return;
    }
    soundButton.disabled = true;
    try {
      await clockAudio.play();
      setSoundState(true);
    } catch {
      soundButton.title = "Sound unavailable";
      soundButton.setAttribute("aria-label", "Sound unavailable");
      soundButton.setAttribute("aria-pressed", "false");
    } finally {
      soundButton.disabled = false;
    }
  });

  // Use a UTC date shifted to Manila time to count calendar months consistently.
  function addManilaMonths(timestamp, months) {
    const local = new Date(timestamp + manilaOffset);
    const year = local.getUTCFullYear();
    const month = local.getUTCMonth() + months;
    const lastDay = new Date(Date.UTC(year, month + 1, 0)).getUTCDate();
    return Date.UTC(
      year, month, Math.min(local.getUTCDate(), lastDay),
      local.getUTCHours(), local.getUTCMinutes(), local.getUTCSeconds(),
      local.getUTCMilliseconds()
    ) - manilaOffset;
  }

  function update() {
    const now = Date.now();
    const ended = now >= target;
    if (ended && !clockAudio.paused) {
      clockAudio.pause();
      setSoundState(false);
    }
    if (ended) soundButton.disabled = true;
    let months = 0;
    let remaining = 0;

    if (!ended) {
      const localNow = new Date(now + manilaOffset);
      const localTarget = new Date(target + manilaOffset);
      months = (localTarget.getUTCFullYear() - localNow.getUTCFullYear()) * 12
        + localTarget.getUTCMonth() - localNow.getUTCMonth();
      if (addManilaMonths(now, months) > target) months -= 1;
      remaining = Math.ceil((target - addManilaMonths(now, months)) / 1000);
    }

    const values = [
      months,
      Math.floor(remaining / 86400),
      Math.floor((remaining % 86400) / 3600),
      Math.floor((remaining % 3600) / 60),
      remaining % 60
    ];
    nodes.forEach((node, index) => {
      node.textContent = String(values[index]).padStart(2, "0");
    });
    clock.classList.toggle("ended", ended);
  }

  update();
  window.setInterval(update, 250);

})();

const sounds = {
  generate: new Audio('/sounds/generate.mp3'),
  reveal: new Audio('/sounds/reveal.mp3'),
  rare: new Audio('/sounds/rare.mp3'),
};

export function playSound(name: keyof typeof sounds): void {
  const sound = sounds[name];
  sound.currentTime = 0;
  sound.play().catch(() => {});
}

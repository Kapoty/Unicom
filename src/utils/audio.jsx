export const isAudioEnabled = () => {
  return (window?.localStorage?.getItem("audio") ?? 'true') === 'true';
};

export const enableAudio = (token) => {
  window.localStorage.setItem("audio", 'true');
};

export const disableAudio = () => {
  window.localStorage.setItem("audio", 'false');
};
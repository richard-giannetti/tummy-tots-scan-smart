
export function isIosSafari(): boolean {
  if (typeof navigator === "undefined" || typeof window === "undefined") return false;
  const ua = navigator.userAgent;
  return (
    /iP(hone|od|ad)/.test(ua) &&
    /Safari/.test(ua) &&
    !/CriOS|FxiOS|OPiOS|EdgiOS/.test(ua) // Not Chrome, Firefox, Opera, Edge on iOS
  );
}

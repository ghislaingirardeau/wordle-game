// on large screen virtual keyboard is not show, so allowed typing keyboard
export function isLargeScreen() {
  return window.innerWidth > 1024 ? false : true;
}

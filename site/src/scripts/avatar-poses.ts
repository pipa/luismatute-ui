/**
 * Pose picker for the lm-avatar demo. Each button sets `pose` on the avatar in
 * the same demo frame and marks itself pressed. Without JS the buttons stay
 * hidden and the avatar keeps its server-rendered pose.
 */
export function setPose(group: HTMLElement, pose: string): void {
  const avatar = group
    .closest('[data-demo-frame]')
    ?.querySelector<HTMLElement>('lm-avatar');
  if (pose) avatar?.setAttribute('pose', pose);
  else avatar?.removeAttribute('pose');
  for (const b of group.querySelectorAll<HTMLButtonElement>('[data-pose]'))
    b.setAttribute('aria-pressed', String(b.dataset.pose === pose));
}

export function initAvatarPoses(root: ParentNode = document): number {
  const groups = [...root.querySelectorAll<HTMLElement>('[data-avatar-poses]')];
  for (const group of groups) {
    group.hidden = false;
    group.addEventListener('click', (e) => {
      const b = (e.target as Element).closest<HTMLButtonElement>('[data-pose]');
      if (b && group.contains(b)) setPose(group, b.dataset.pose ?? '');
    });
  }
  return groups.length;
}

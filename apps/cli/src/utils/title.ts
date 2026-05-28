import figlet from 'figlet';
import {
  atlas,
  cristal,
  fruit,
  instagram,
  mind,
  morning,
  passion,
  pastel,
  rainbow,
  retro,
  summer,
  teen,
  vice,
} from 'gradient-string';

/** Block ASCII title with a multi-stop gradient (gradient-string style). */
export function renderTitle(): string {
  const colors = [
    cristal,
    teen,
    mind,
    morning,
    vice,
    passion,
    fruit,
    instagram,
    atlas,
    retro,
    summer,
    pastel,
    rainbow,
  ];

  const ascii =
    figlet.textSync('@madda', {
      font: 'Standard',
      horizontalLayout: 'universal smushing',
    }) ?? '@madda';

  const gradient = colors[Math.floor(Math.random() * colors.length)]!;
  return gradient(ascii);
}

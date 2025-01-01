export class ColorPalette {
  private definedColors: string[];
  private static predefinedColors = [
    'red',
    'blue',
    'green',
    'yellow',
    'purple',
    'orange',
    'pink',
    'brown',
    'gray',
    'cyan',
  ];

  constructor() {
    this.definedColors = [];
  }

  getColor(): string {
    const availableColors = ColorPalette.predefinedColors.filter(
      (c) => this.definedColors.indexOf(c) === -1
    );
    const randomColor =
      availableColors[Math.floor(Math.random() * availableColors.length)];

    this.definedColors.push(randomColor);
    return randomColor;
  }
}

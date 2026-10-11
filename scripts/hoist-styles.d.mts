export function hoistInlineStyles(svg: string): {
  svg: string;
  rules: Map<string, string>;
};

export function rulesToCss(rules: Map<string, string>): string;

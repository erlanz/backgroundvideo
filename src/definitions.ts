export interface BackgroundVideoPlugin {
  echo(options: { value: string }): Promise<{ value: string }>;
}

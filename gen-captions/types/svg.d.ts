declare module '*.svg' {
  const content: {
    src: string;
    height: number;
    width: number;
    blurWidth?: number;
    blurHeight?: number;
  };
  export default content;
}

declare module '*.svg?url' {
  const content: string;
  export default content;
}
/// <reference types="expo/types" />

// Add custom type declarations here
declare module '*.png' {
  const value: any;
  export default value;
}

declare module '*.jpg' {
  const value: any;
  export default value;
}

declare module '*.jpeg' {
  const value: any;
  export default value;
}

declare module '*.gif' {
  const value: any;
  export default value;
}

declare module '*.svg' {
  const value: any;
  export default value;
}

declare module '*.wav' {
  const value: any;
  export default value;
}

declare module '*.mp3' {
  const value: any;
  export default value;
}

// Global type augmentations
declare global {
  interface Window {
    __DEV__: boolean;
  }
}

export {};
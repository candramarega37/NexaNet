import type { DetailedHTMLProps, HTMLAttributes, ReactNode } from "react";

declare module "react" {
  namespace JSX {
    interface IntrinsicElements {
      "model-viewer": DetailedHTMLProps<HTMLAttributes<HTMLElement>, HTMLElement> & {
        src?: string;
        poster?: string;
        alt?: string;
        loading?: "eager" | "lazy";
        "camera-controls"?: boolean;
        "auto-rotate"?: boolean;
        "rotation-per-second"?: string;
        exposure?: string;
        "environment-image"?: string;
        "touch-action"?: string;
        "shadow-intensity"?: string;
        children?: ReactNode;
      };
    }
  }
}

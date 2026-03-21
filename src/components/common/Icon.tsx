import type { SVGProps } from "react";
export type IconSource = string | React.ComponentType<SVGProps<SVGSVGElement>>;

interface IconProps extends Omit<SVGProps<SVGSVGElement>, "width" | "height"> {
  icon: IconSource;
  size?: number;
  color?: string;
}

export const Icon = ({
  icon: IconComponent,
  size = 24,
  color,
  className,
  ...props
}: IconProps) => {
  const combinedClassName = [color, className].filter(Boolean).join(" ");

  if (typeof IconComponent === "string") {
    return (
      <img
        src={IconComponent}
        width={size}
        height={size}
        className={combinedClassName}
        alt=""
        aria-hidden="true"
      />
    );
  }

  return (
    <IconComponent
      width={size}
      height={size}
      className={combinedClassName}
      aria-hidden="true"
      {...props}
    />
  );
};

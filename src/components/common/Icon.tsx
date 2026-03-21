import type { SVGProps } from "react";

interface IconProps extends Omit<SVGProps<SVGSVGElement>, "width" | "height"> {
  icon: React.ComponentType<SVGProps<SVGSVGElement>>;
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

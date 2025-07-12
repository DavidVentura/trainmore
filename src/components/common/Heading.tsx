import { Flex, Heading as HeadingBase } from "@radix-ui/themes";
import type { LucideIcon } from "lucide-react";

interface HeadingProps extends React.ComponentProps<typeof HeadingBase> {
  icon?: LucideIcon;
}

export const Heading = ({ children, icon: Icon, color, ...props }: HeadingProps) => {
  const headingColor = color ?? "gray";
  const iconColor = `var(--${headingColor}-a11)`;
  const size = `calc(var(--line-height) * 0.8)`;

  return (
    <Flex align="center" gap="1" asChild>
      <HeadingBase {...props} color={headingColor}>
        {Icon && (
          <Icon
            style={{
              height: size,
              width: size,
            }}
            strokeWidth={1.5}
            color={iconColor}
            aria-hidden
          />
        )}
        {children}
      </HeadingBase>
    </Flex>
  );
};

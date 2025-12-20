import { cn } from "@/shared/lib/utils/tailwindcss"

type BrandMarkProps = React.SVGProps<SVGSVGElement>

export const BrandLogo = ({
  className,
  ...props
}: BrandMarkProps) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 16 16"
      fill="none"
      className={cn(className)}
      {...props}
    >
      <path
        d="M7.75 0.75L11.75 7.75L7.75 14.75L3.75 7.75L7.75 0.75Z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        opacity="0.25" d="M7.75 4.75L9.75 7.75L7.75 10.75L5.75 7.75L7.75 4.75Z"
        fill="currentColor"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        opacity="0.5"
        d="M2.75 12.75V3.75"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round" />
      <path
        opacity="0.25"
        d="M0.75 10.75V5.75"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round" />
      <path
        opacity="0.5"
        d="M12.75 12.75V3.75"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round" />
      <path
        opacity="0.3"
        d="M14.75 10.75V5.75"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round" />
    </svg>
  )
}

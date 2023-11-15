import { useTheme } from "next-themes"

export const Theme = () => {
     const { theme } = useTheme()
     return theme
}

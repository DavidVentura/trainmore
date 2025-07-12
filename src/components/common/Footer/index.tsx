import { Box, Flex, Link, Text } from "@radix-ui/themes"
import { CalendarDays, Dumbbell, HomeIcon } from "lucide-react"
import { NavLink } from "react-router"
import "./styles.css"

const FooterItem = ({icon, label, to}: {icon: React.ReactNode, label: string, to: string}) => {
  return (
    <Box className='footer-item-container'>
      <Link asChild underline="none">
        <NavLink to={to}>
          {({ isActive }) => (
            <Flex align="center" justify="center" gap="0" direction="column" p="2" className="footer-item" data-active={isActive}>
              {icon}
              <Text size="1" weight="medium">{label}</Text>
            </Flex>
          )}
        </NavLink>
      </Link>
    </Box>
  );
}

export const Footer = () => {
  return (
    <Flex justify="center" align="center" height="100%" gap="2" px="2" className="footer-root">
      <FooterItem icon={<HomeIcon />} label="Home" to="/" />
      <FooterItem icon={<CalendarDays />} label="Visits" to="/visits" />
      <FooterItem icon={<Dumbbell />} label="Workout" to="/workout" />
    </Flex>
  );
}
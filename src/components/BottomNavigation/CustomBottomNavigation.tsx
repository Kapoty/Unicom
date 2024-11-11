import { Home, CreditCard, AddCard } from "@mui/icons-material";
import { Paper, Divider, BottomNavigation, BottomNavigationAction } from "@mui/material";

const CustomBottomNavigation = () => {
	return <Paper elevation={0}>
		<Divider/>
		<BottomNavigation
			showLabels
			value={0}
		>
			<BottomNavigationAction label="Início" icon={<Home />} />
			<BottomNavigationAction label="Vendas" icon={<CreditCard />} />
			<BottomNavigationAction label="Nova Venda" icon={<AddCard />} />
		</BottomNavigation>
	</Paper>
}

export default CustomBottomNavigation;
import { Icon, styled, SvgIcon, SvgIconProps } from '@mui/material';
import Loading from '../../assets/svg/loading-icon.svg';

const StyledLoadingIcon = styled(SvgIcon)<SvgIconProps>(() => ({
	'animation': 'loading-anim 3s infinite alternate',

	'@keyframes loading-anim': {
		'from': {
			opacity: 1,
		},
		'to': {
			opacity: 0,
		}
	}
}));

const LoadingIcon = () => {
	return <Icon>
		<StyledLoadingIcon component={Loading} inheritViewBox />
	</Icon>
}

export default LoadingIcon;
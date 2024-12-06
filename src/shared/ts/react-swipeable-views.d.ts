declare module 'react-swipeable-views' {
	import * as React from 'react';
  
	interface SwipeableViewsProps {
	  index?: number;
	  onChangeIndex?: (index: number, previousIndex: number) => void;
	  children?: React.ReactNode;
	  enableMouseEvents?: boolean;
	  resistance?: boolean;
	  disabled?: boolean;
	  springConfig?: { duration: string; easeFunction: string; delay: string };
	  style?: React.CSSProperties;
	  containerStyle?: React.CSSProperties;
	  slideStyle?: React.CSSProperties;
	}
  
	const SwipeableViews: React.FC<SwipeableViewsProps>;
	export default SwipeableViews;
  }
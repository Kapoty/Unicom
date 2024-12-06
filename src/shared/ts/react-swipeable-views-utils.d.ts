declare module 'react-swipeable-views-utils' {
	import { ReactElement } from 'react';
	import { SwipeableViewsProps } from 'react-swipeable-views';
  
	export interface SlideRendererParams {
	  index: number;
	  key?: string;
	}
  
	export function virtualize(
	  component: React.ComponentType<SwipeableViewsProps>
	): React.ComponentType<
	  SwipeableViewsProps & { slideRenderer: (params: SlideRendererParams) => ReactElement }
	>;
  }
import {useEffect} from 'react';
import { useMediaQuery } from '@mui/material';
import useAppStore from '../state/useAppStore';

const useMobileSync = () => {
  const isMobile = useMediaQuery('(max-width: 600px)');
  const setMobile = useAppStore((state) => state.setMobile);
  
  useEffect(() => {
    setMobile(isMobile);
  }, [isMobile, setMobile]);
};

export default useMobileSync;
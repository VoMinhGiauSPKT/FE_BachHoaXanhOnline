import { useState, useEffect } from 'react';

/**
 * Custom Hook nhận diện thiết bị đa tiêu chí:
 * 1. Cách 4: Client Hints API (navigator.userAgentData.mobile) & Routing/Subdomain (m. hoặc /m)
 * 2. Cách 2: User-Agent String Regex (nhận diện thiết bị di động iOS, Android,...)
 * 3. Cách 3: Touch & Pointer Events (màn hình cảm ứng kết hợp con trỏ thô ngón tay)
 */
export const useDeviceDetect = () => {
  const checkDevice = () => {
    if (typeof window === 'undefined') {
      return { isMobile: false, isTablet: false, isDesktop: true, isTouchDevice: false };
    }

    // --- CÁCH 4: Client Hints API & Routing/Subdomain ---
    const isClientHintsMobile = Boolean(navigator.userAgentData?.mobile);
    const isSubdomainMobile = window.location.hostname.startsWith('m.');
    const isRouteMobile = window.location.pathname.startsWith('/m/') || window.location.pathname === '/m';
    const method4_ClientHintsAndRouting = isClientHintsMobile || isSubdomainMobile || isRouteMobile;

    // --- CÁCH 2: User-Agent String ---
    const userAgent = navigator.userAgent || navigator.vendor || window.opera || '';
    const mobileUARegex = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini|Mobile|mobile|CriOS/i;
    const tabletUARegex = /(ipad|tablet|(android(?!.*mobile))|(windows(?!.*phone)(.*touch))|kindle|playbook|silk)/i;
    
    const method2_UserAgentMobile = mobileUARegex.test(userAgent);
    const isUserAgentTablet = tabletUARegex.test(userAgent);

    // --- CÁCH 3: Touch & Pointer Events ---
    const hasTouchPoints = Boolean(
      'ontouchstart' in window ||
      navigator.maxTouchPoints > 0 ||
      navigator.msMaxTouchPoints > 0
    );
    const hasCoarsePointer = window.matchMedia ? window.matchMedia('(pointer: coarse)').matches : false;
    const method3_TouchAndPointer = hasTouchPoints && hasCoarsePointer;

    // --- TỔNG HỢP: Xác định Mobile nếu thỏa mãn bất kỳ tiêu chí nào ---
    const isMobile = Boolean(
      method4_ClientHintsAndRouting ||
      method2_UserAgentMobile ||
      method3_TouchAndPointer
    );

    const isTablet = isUserAgentTablet && !isMobile;
    const isDesktop = !isMobile && !isTablet;

    return {
      isMobile,
      isTablet,
      isDesktop,
      isTouchDevice: hasTouchPoints,
      details: {
        clientHintsOrRouting: method4_ClientHintsAndRouting,
        userAgentMatch: method2_UserAgentMobile,
        touchPointerMatch: method3_TouchAndPointer
      }
    };
  };

  const [deviceInfo, setDeviceInfo] = useState(checkDevice);

  useEffect(() => {
    const handleResizeOrChange = () => {
      setDeviceInfo(checkDevice());
    };

    window.addEventListener('resize', handleResizeOrChange);
    window.addEventListener('orientationchange', handleResizeOrChange);

    return () => {
      window.removeEventListener('resize', handleResizeOrChange);
      window.removeEventListener('orientationchange', handleResizeOrChange);
    };
  }, []);

  return deviceInfo;
};

export default useDeviceDetect;

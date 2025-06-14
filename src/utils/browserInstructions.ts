
export interface BrowserInstructions {
  browser: string;
  steps: string[];
}

export const getBrowserInstructions = (): BrowserInstructions => {
  const userAgent = navigator.userAgent.toLowerCase();
  
  if (userAgent.includes('safari') && userAgent.includes('mobile')) {
    return {
      browser: 'iOS Safari',
      steps: [
        'Tap the "AA" icon in the address bar',
        'Select "Website Settings"',
        'Tap "Camera" and choose "Allow"',
        'Refresh this page'
      ]
    };
  } else if (userAgent.includes('chrome') && userAgent.includes('mobile')) {
    return {
      browser: 'Chrome Mobile',
      steps: [
        'Tap the lock icon next to the URL',
        'Tap "Permissions"',
        'Enable "Camera"',
        'Refresh this page'
      ]
    };
  } else if (userAgent.includes('chrome')) {
    return {
      browser: 'Chrome Desktop',
      steps: [
        'Click the camera icon in the address bar',
        'Select "Always allow" or "Allow"',
        'Refresh if needed'
      ]
    };
  } else if (userAgent.includes('firefox')) {
    return {
      browser: 'Firefox',
      steps: [
        'Click the camera icon in the address bar',
        'Choose "Allow" and check "Remember this decision"',
        'Refresh if needed'
      ]
    };
  }
  
  return {
    browser: 'Your Browser',
    steps: [
      'Look for a camera icon in your browser\'s address bar',
      'Click it and allow camera access',
      'You may need to refresh the page'
    ]
  };
};

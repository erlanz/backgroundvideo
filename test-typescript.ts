import { BackgroundVideo } from './src/index';

// Test TypeScript compilation and method recognition
async function testTypeScriptSupport() {
  try {
    // Test all methods to ensure TypeScript recognizes them
    await BackgroundVideo.playVideo({ path: 'assets/video/intro.mp4' });
    await BackgroundVideo.pauseVideo();
    await BackgroundVideo.resumeVideo();
    await BackgroundVideo.stopVideo();
    await BackgroundVideo.setVolume({ volume: 0.5 });
    
    console.log('✅ All TypeScript methods are properly recognized!');
  } catch (error) {
    console.error('❌ TypeScript test failed:', error);
  }
}

// Export for testing
export { testTypeScriptSupport }; 
import { BackgroundVideo } from './src/index';

/**
 * Test file demonstrating the enhanced BackgroundVideo plugin functionality
 * This shows all the different video path types that are now supported
 */

async function testAllVideoSources() {
  console.log('🎬 Testing BackgroundVideo plugin with different sources...');

  try {
    // Test 1: Assets path (should be transformed to HTTP URL)
    console.log('\n1️⃣ Testing assets path...');
    await BackgroundVideo.playVideo({ 
      path: 'assets/video/intro.mp4' 
    });
    console.log('✅ Assets video started successfully');
    
    await new Promise(resolve => setTimeout(resolve, 2000)); // Wait 2 seconds
    await BackgroundVideo.stopVideo();

    // Test 2: Remote HTTP URL
    console.log('\n2️⃣ Testing remote HTTP URL...');
    await BackgroundVideo.playVideo({ 
      path: 'https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_1mb.mp4' 
    });
    console.log('✅ Remote video started successfully');
    
    await new Promise(resolve => setTimeout(resolve, 2000));
    await BackgroundVideo.stopVideo();

    // Test 3: Bundle resource (bare filename)
    console.log('\n3️⃣ Testing bundle resource...');
    await BackgroundVideo.playVideo({ 
      path: 'intro' 
    });
    console.log('✅ Bundle video started successfully');
    
    await new Promise(resolve => setTimeout(resolve, 2000));
    await BackgroundVideo.stopVideo();

    // Test 4: Local filesystem path
    console.log('\n4️⃣ Testing local filesystem path...');
    await BackgroundVideo.playVideo({ 
      path: '/path/to/local/video.mp4' 
    });
    console.log('✅ Local video started successfully');
    
    await new Promise(resolve => setTimeout(resolve, 2000));
    await BackgroundVideo.stopVideo();

    console.log('\n🎉 All tests completed successfully!');

  } catch (error) {
    console.error('❌ Test failed:', error);
  }
}

async function testPlaybackControls() {
  console.log('\n🎮 Testing playback controls...');

  try {
    // Start video
    await BackgroundVideo.playVideo({ 
      path: 'assets/video/intro.mp4' 
    });
    console.log('✅ Video started');

    // Test pause
    await new Promise(resolve => setTimeout(resolve, 1000));
    await BackgroundVideo.pauseVideo();
    console.log('✅ Video paused');

    // Test resume
    await new Promise(resolve => setTimeout(resolve, 1000));
    await BackgroundVideo.resumeVideo();
    console.log('✅ Video resumed');

    // Test volume
    await BackgroundVideo.setVolume({ volume: 0.3 });
    console.log('✅ Volume set to 0.3');

    // Test stop
    await new Promise(resolve => setTimeout(resolve, 1000));
    await BackgroundVideo.stopVideo();
    console.log('✅ Video stopped');

  } catch (error) {
    console.error('❌ Playback control test failed:', error);
  }
}

// Example usage in a real application
async function exampleUsage() {
  console.log('\n📱 Example usage in a real app...');

  try {
    // Simple usage - just play assets video
    await BackgroundVideo.playVideo({ 
      path: 'assets/video/intro.mp4' 
    });
    
    console.log('✅ Background video is now playing!');
    console.log('💡 The video will loop automatically');
    console.log('💡 Use pauseVideo(), resumeVideo(), stopVideo() to control playback');
    
  } catch (error) {
    console.error('❌ Example usage failed:', error);
  }
}

// Export functions for testing
export {
  testAllVideoSources,
  testPlaybackControls,
  exampleUsage
};

// Run tests if this file is executed directly
if (typeof window !== 'undefined') {
  // Browser environment
  (window as any).testBackgroundVideo = {
    testAllVideoSources,
    testPlaybackControls,
    exampleUsage
  };
  
  console.log('🧪 BackgroundVideo tests loaded. Use window.testBackgroundVideo to run tests.');
} 
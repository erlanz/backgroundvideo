package com.mycompany.plugins.example;

import android.app.Activity;
import android.widget.VideoView;
import android.widget.FrameLayout;
import android.media.MediaPlayer;
import android.view.ViewGroup;
import android.view.View;
import android.net.Uri;
import com.getcapacitor.Logger;

public class BackgroundVideo {
    private VideoView videoView;
    private Activity activity;

    public void setActivity(Activity activity) {
        this.activity = activity;
    }

    public void playVideo(String path) {
        if (activity == null) {
            Logger.error("BackgroundVideo", "Activity is null", new Exception("Activity is null"));
            return;
        }

        activity.runOnUiThread(() -> {
            try {
                // Инициализируем VideoView, если еще не создан
                if (videoView == null) {
                    videoView = new VideoView(activity);
                    
                    // Задаем видео на весь экран
                    FrameLayout.LayoutParams layoutParams = new FrameLayout.LayoutParams(
                        ViewGroup.LayoutParams.MATCH_PARENT,
                        ViewGroup.LayoutParams.MATCH_PARENT
                    );
                    videoView.setLayoutParams(layoutParams);
                    
                    // Находим корневой контейнер Activity и добавляем видеоView в него
                    View contentView = activity.findViewById(android.R.id.content);
                    if (contentView instanceof ViewGroup) {
                        ViewGroup viewGroup = (ViewGroup) contentView;
                        viewGroup.addView(videoView, 0); // добавляем по индексу 0, чтобы он был позади остальных view
                    }
                }
                
                // Создаем URI из пути (теперь path уже содержит правильный URI)
                Uri videoUri = Uri.parse(path);
                
                // Устанавливаем файл видео и запускаем
                videoView.setVideoURI(videoUri);
                videoView.setOnPreparedListener(new MediaPlayer.OnPreparedListener() {
                    @Override
                    public void onPrepared(MediaPlayer mp) {
                        mp.setLooping(true); // зациклить видео
                        videoView.start();
                    }
                });
                
                // Handle completion for looping
                videoView.setOnCompletionListener(new MediaPlayer.OnCompletionListener() {
                    @Override
                    public void onCompletion(MediaPlayer mp) {
                        videoView.start(); // Restart for looping
                    }
                });
                
            } catch (Exception e) {
                Logger.error("BackgroundVideo", "Error playing video: " + e.getMessage(), e);
            }
        });
    }

    public void pauseVideo() {
        if (videoView != null) {
            activity.runOnUiThread(() -> {
                videoView.pause();
            });
        }
    }

    public void resumeVideo() {
        if (videoView != null) {
            activity.runOnUiThread(() -> {
                videoView.start();
            });
        }
    }

    public void stopVideo() {
        if (videoView != null) {
            activity.runOnUiThread(() -> {
                videoView.stopPlayback();
                if (videoView.getParent() instanceof ViewGroup) {
                    ViewGroup parent = (ViewGroup) videoView.getParent();
                    parent.removeView(videoView);
                }
                videoView = null;
            });
        }
    }

    public void setVolume(float volume) {
        if (videoView != null) {
            activity.runOnUiThread(() -> {
                // VideoView не имеет прямого метода setVolume, но можно получить MediaPlayer
                // и установить громкость через него
                try {
                    // This may not work on all devices
                    // Better to use ExoPlayer for more precise control
                } catch (Exception e) {
                    Logger.error("BackgroundVideo", "Error setting volume: " + e.getMessage(), e);
                }
            });
        }
    }
}

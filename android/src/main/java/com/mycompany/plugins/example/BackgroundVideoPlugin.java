package com.mycompany.plugins.example;

import com.getcapacitor.JSObject;
import com.getcapacitor.Plugin;
import com.getcapacitor.PluginCall;
import com.getcapacitor.PluginMethod;
import com.getcapacitor.annotation.CapacitorPlugin;

@CapacitorPlugin(name = "BackgroundVideo")
public class BackgroundVideoPlugin extends Plugin {

    private BackgroundVideo implementation = new BackgroundVideo();

    @Override
    public void load() {
        super.load();
        implementation.setActivity(getActivity());
    }

    @PluginMethod
    public void playVideo(PluginCall call) {
        String path = call.getString("path");
        if (path == null || path.isEmpty()) {
            call.reject("No video path provided");
            return;
        }
        
        implementation.playVideo(path);
        call.resolve();
    }

    @PluginMethod
    public void pauseVideo(PluginCall call) {
        implementation.pauseVideo();
        call.resolve();
    }

    @PluginMethod
    public void resumeVideo(PluginCall call) {
        implementation.resumeVideo();
        call.resolve();
    }

    @PluginMethod
    public void stopVideo(PluginCall call) {
        implementation.stopVideo();
        call.resolve();
    }

    @PluginMethod
    public void setVolume(PluginCall call) {
        Double volume = call.getDouble("volume");
        if (volume == null) {
            volume = 1.0;
        }
        implementation.setVolume(volume.floatValue());
        call.resolve();
    }
}

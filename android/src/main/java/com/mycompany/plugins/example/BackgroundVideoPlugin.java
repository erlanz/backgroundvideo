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
        String name = call.getString("path");
        if (name == null || name.isEmpty()) {
            name = "intro";
        }
        
        // ищем raw ресурс
        int resId = getActivity().getResources().getIdentifier(name, "raw", getActivity().getPackageName());
        if (resId == 0) {
            call.reject("Raw resource not found: " + name);
            return;
        }
        
        // создаем URI для raw ресурса
        String uri = "android.resource://" + getActivity().getPackageName() + "/raw/" + name;
        
        implementation.playVideo(uri);
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

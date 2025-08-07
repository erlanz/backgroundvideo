import Foundation
import Capacitor

/**
 * Please read the Capacitor iOS Plugin Development Guide
 * here: https://capacitorjs.com/docs/plugins/ios
 */
@objc(BackgroundVideoPlugin)
public class BackgroundVideoPlugin: CAPPlugin, CAPBridgedPlugin {
    public let identifier = "BackgroundVideoPlugin"
    public let jsName = "BackgroundVideo"
    public let pluginMethods: [CAPPluginMethod] = [
        CAPPluginMethod(name: "playVideo", returnType: CAPPluginReturnPromise),
        CAPPluginMethod(name: "pauseVideo", returnType: CAPPluginReturnPromise),
        CAPPluginMethod(name: "resumeVideo", returnType: CAPPluginReturnPromise),
        CAPPluginMethod(name: "stopVideo", returnType: CAPPluginReturnPromise),
        CAPPluginMethod(name: "setVolume", returnType: CAPPluginReturnPromise)
    ]
    private let implementation = BackgroundVideo()

    @objc func playVideo(_ call: CAPPluginCall) {
        let path = call.getString("path") ?? ""
        implementation.playVideo(path: path)
        call.resolve()
    }
    
    @objc func pauseVideo(_ call: CAPPluginCall) {
        implementation.pauseVideo()
        call.resolve()
    }
    
    @objc func resumeVideo(_ call: CAPPluginCall) {
        implementation.resumeVideo()
        call.resolve()
    }
    
    @objc func stopVideo(_ call: CAPPluginCall) {
        implementation.stopVideo()
        call.resolve()
    }
    
    @objc func setVolume(_ call: CAPPluginCall) {
        let volume = call.getDouble("volume") ?? 1.0
        implementation.setVolume(volume: Float(volume))
        call.resolve()
    }
}

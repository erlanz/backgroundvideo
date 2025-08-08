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
        CAPPluginMethod(name: "setVolume", returnType: CAPPluginReturnPromise),
        CAPPluginMethod(name: "listResources", returnType: CAPPluginReturnPromise)
    ]
    private let implementation = BackgroundVideo()

    @objc func playVideo(_ call: CAPPluginCall) {
        let path = call.getString("path") ?? "intro"
        
        // Логируем входящий путь для диагностики
        print("BackgroundVideo: Received path: \(path)")
        
        // Проверяем, является ли путь полным URL или файловым путем
        if path.hasPrefix("http://") || path.hasPrefix("https://") {
            // Это HTTP URL - передаем напрямую
            print("BackgroundVideo: Using HTTP URL: \(path)")
            implementation.playVideo(path: path)
            call.resolve()
            return
        }
        
        // Проверяем, является ли путь полным файловым путем
        if path.hasPrefix("/") {
            // Это полный путь к файлу - передаем напрямую
            print("BackgroundVideo: Using full file path: \(path)")
            implementation.playVideo(path: path)
            call.resolve()
            return
        }
        
        // Это имя ресурса - ищем в bundle
        print("BackgroundVideo: Looking for resource: \(path)")
        
        // Пробуем разные расширения
        let extensions = ["mp4", "mov", "m4v"]
        var foundURL: URL? = nil
        
        for ext in extensions {
            if let url = Bundle.main.url(forResource: path, withExtension: ext) {
                foundURL = url
                print("BackgroundVideo: Found resource: \(url.path)")
                break
            }
        }
        
        if let url = foundURL {
            // Ресурс найден - передаем путь к файлу
            print("BackgroundVideo: Using bundle resource: \(url.path)")
            implementation.playVideo(path: url.path)
            call.resolve()
        } else {
            // Ресурс не найден - возвращаем ошибку с подробной информацией
            let bundlePath = Bundle.main.bundlePath
            let availableResources = Bundle.main.paths(forResourcesOfType: nil, inDirectory: nil)
            print("BackgroundVideo: Bundle path: \(bundlePath)")
            print("BackgroundVideo: Available resources: \(availableResources)")
            
            call.reject("Resource not found in bundle: \(path).mp4/mov/m4v. Bundle path: \(bundlePath)")
        }
    }
    
    @objc func listResources(_ call: CAPPluginCall) {
        let bundlePath = Bundle.main.bundlePath
        let allResources = Bundle.main.paths(forResourcesOfType: nil, inDirectory: nil)
        let videoResources = Bundle.main.paths(forResourcesOfType: "mp4", inDirectory: nil) +
                           Bundle.main.paths(forResourcesOfType: "mov", inDirectory: nil) +
                           Bundle.main.paths(forResourcesOfType: "m4v", inDirectory: nil)
        
        let result = JSObject()
        result["bundlePath"] = bundlePath
        result["allResources"] = allResources
        result["videoResources"] = videoResources
        
        print("BackgroundVideo: Bundle path: \(bundlePath)")
        print("BackgroundVideo: All resources: \(allResources)")
        print("BackgroundVideo: Video resources: \(videoResources)")
        
        call.resolve(result)
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

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
        let useWindow = call.getBool("useWindow") ?? false // По умолчанию используем слой в основном окне

        // Логируем входящий путь для диагностики
        print("BackgroundVideo: Received path: \(path), useWindow: \(useWindow)")

        // Сделать WebView и контейнер прозрачными, чтобы видео было видно под ним
        DispatchQueue.main.async { [weak self] in
            guard let self = self else { return }
            if let webView = self.bridge?.webView {
                webView.isOpaque = false
                webView.backgroundColor = .clear
                webView.scrollView.backgroundColor = .clear
                print("BackgroundVideo: Made WKWebView transparent")
            }
            if let vc = self.bridge?.viewController {
                vc.view.backgroundColor = .clear
                print("BackgroundVideo: Made root VC background clear")
            }
            if let windowScene = UIApplication.shared.connectedScenes.first as? UIWindowScene,
               let window = windowScene.windows.first {
                window.backgroundColor = .clear
                print("BackgroundVideo: Made main window background clear")
            }
        }

        // Проверяем, является ли путь полным URL или файловым путем
        if path.hasPrefix("http://") || path.hasPrefix("https://") {
            print("BackgroundVideo: Using HTTP URL: \(path)")
            implementation.playVideo(path: path, useWindow: useWindow)
            call.resolve()
            return
        }

        if path.hasPrefix("/") {
            print("BackgroundVideo: Using full file path: \(path)")
            implementation.playVideo(path: path, useWindow: useWindow)
            call.resolve()
            return
        }

        print("BackgroundVideo: Looking for resource: \(path)")
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
            print("BackgroundVideo: Using bundle resource: \(url.path)")
            implementation.playVideo(path: url.path, useWindow: useWindow)
            call.resolve()
        } else {
            let bundlePath = Bundle.main.bundlePath
            call.reject("Resource not found in bundle: \(path).mp4/mov/m4v. Bundle path: \(bundlePath)")
        }
    }

    @objc func listResources(_ call: CAPPluginCall) {
        let bundlePath = Bundle.main.bundlePath
        let allResources = Bundle.main.paths(forResourcesOfType: nil, inDirectory: nil)
        let videoResources = Bundle.main.paths(forResourcesOfType: "mp4", inDirectory: nil) +
                           Bundle.main.paths(forResourcesOfType: "mov", inDirectory: nil) +
                           Bundle.main.paths(forResourcesOfType: "m4v", inDirectory: nil)
        var result = JSObject()
        result["bundlePath"] = bundlePath
        result["allResources"] = allResources
        result["videoResources"] = videoResources
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

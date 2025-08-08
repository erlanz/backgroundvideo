import Foundation
import Capacitor
import AVKit

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
        let useWindow = call.getBool("useWindow") ?? false // default: in-view layer
        let fullscreen = call.getBool("fullscreen") ?? false

        print("BackgroundVideo: Received path: \(path), useWindow: \(useWindow), fullscreen: \(fullscreen)")

        // Ensure transparency of the app surfaces so the video behind is visible
        DispatchQueue.main.async { [weak self] in
            guard let self = self else { return }
            if let webView = self.bridge?.webView {
                webView.isOpaque = false
                webView.backgroundColor = .clear
                webView.scrollView.backgroundColor = .clear
                webView.scrollView.layer.backgroundColor = UIColor.clear.cgColor
                if #available(iOS 15.0, *) {
                    webView.underPageBackgroundColor = .clear
                }
            }
            if let vc = self.bridge?.viewController {
                vc.view.isOpaque = false
                vc.view.backgroundColor = .clear
                vc.view.layer.backgroundColor = UIColor.clear.cgColor
            }
            if let windowScene = UIApplication.shared.connectedScenes.first as? UIWindowScene,
               let window = windowScene.windows.first {
                window.backgroundColor = .clear
                window.isOpaque = false
                window.layer.backgroundColor = UIColor.clear.cgColor
            }
        }

        // Fullscreen mode using AVPlayerViewController (always visible above WebView)
        if fullscreen {
            guard let url = self.resolveUrl(path: path) else {
                call.reject("Unable to resolve video path for fullscreen mode")
                return
            }
            DispatchQueue.main.async { [weak self] in
                guard let self = self else { return }
                let player = AVPlayer(url: url)
                let vc = AVPlayerViewController()
                vc.player = player
                vc.modalPresentationStyle = .fullScreen
                self.bridge?.viewController?.present(vc, animated: true) {
                    player.play()
                }
                print("BackgroundVideo: Presented AVPlayerViewController fullscreen")
                call.resolve()
            }
            return
        }

        // Background modes
        if path.hasPrefix("http://") || path.hasPrefix("https://") {
            implementation.playVideo(path: path, useWindow: useWindow)
            call.resolve()
            return
        }

        if path.hasPrefix("/") {
            implementation.playVideo(path: path, useWindow: useWindow)
            call.resolve()
            return
        }

        let extensions = ["mp4", "mov", "m4v"]
        var foundURL: URL? = nil
        for ext in extensions {
            if let url = Bundle.main.url(forResource: path, withExtension: ext) {
                foundURL = url
                break
            }
        }

        if let url = foundURL {
            implementation.playVideo(path: url.path, useWindow: useWindow)
            call.resolve()
        } else {
            let bundlePath = Bundle.main.bundlePath
            call.reject("Resource not found in bundle: \(path).mp4/mov/m4v. Bundle path: \(bundlePath)")
        }
    }

    private func resolveUrl(path: String) -> URL? {
        if path.hasPrefix("http://") || path.hasPrefix("https://") { return URL(string: path) }
        if path.hasPrefix("/") { return URL(fileURLWithPath: path) }
        let extensions = ["mp4", "mov", "m4v"]
        for ext in extensions {
            if let url = Bundle.main.url(forResource: path, withExtension: ext) { return url }
        }
        return nil
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

import Foundation
import AVFoundation
import UIKit

@objc public class BackgroundVideo: NSObject {
    private var player: AVPlayer?
    private var playerLayer: AVPlayerLayer?
    private var videoWindow: UIWindow?
    
    @objc public func playVideo(path: String, useWindow: Bool = false) {
        guard !path.isEmpty else {
            print("BackgroundVideo: No video path provided")
            return
        }
        
        print("BackgroundVideo: Creating player for path: \(path), useWindow: \(useWindow)")
        
        let url: URL
        if path.hasPrefix("http://") || path.hasPrefix("https://") {
            guard let remoteUrl = URL(string: path) else {
                print("BackgroundVideo: Invalid remote URL: \(path)")
                return
            }
            url = remoteUrl
            print("BackgroundVideo: Using remote URL: \(url)")
        } else if path.hasPrefix("/") {
            url = URL(fileURLWithPath: path)
            print("BackgroundVideo: Using filesystem path: \(url)")
        } else {
            print("BackgroundVideo: Looking for bundle resource: \(path)")
            guard let bundleUrl = Bundle.main.url(forResource: path, withExtension: "mp4") else {
                print("BackgroundVideo: Resource not found in bundle: \(path).mp4")
                return
            }
            url = bundleUrl
            print("BackgroundVideo: Found bundle resource: \(url)")
        }
        
        player = AVPlayer(url: url)
        player?.actionAtItemEnd = .none
        
        let layer = AVPlayerLayer(player: player)
        layer.videoGravity = .resizeAspectFill
        layer.backgroundColor = UIColor.clear.cgColor
        self.playerLayer = layer
        
        DispatchQueue.main.async { [weak self] in
            guard let self = self else { return }
            if useWindow {
                print("BackgroundVideo: Using separate window method")
                self.setupVideoWindow(layer: layer)
                return
            }
            if let windowScene = UIApplication.shared.connectedScenes.first as? UIWindowScene,
               let window = windowScene.windows.first,
               let rootViewController = window.rootViewController {
                
                rootViewController.view.backgroundColor = .clear
                layer.frame = rootViewController.view.bounds
                print("BackgroundVideo: Layer frame set to: \(layer.frame)")
                
                if let existingLayer = rootViewController.view.layer.sublayers?.first(where: { $0 is AVPlayerLayer }) {
                    existingLayer.removeFromSuperlayer()
                    print("BackgroundVideo: Removed existing video layer")
                }
                
                layer.zPosition = -1 // позади контента
                print("BackgroundVideo: Set layer z-position to: \(layer.zPosition)")
                
                rootViewController.view.layer.insertSublayer(layer, at: 0)
                print("BackgroundVideo: Video layer inserted at index 0")
                
                layer.isHidden = false
                layer.opacity = 1.0
                
                self.player?.play()
                print("BackgroundVideo: Video started playing")
                
                NotificationCenter.default.removeObserver(self, name: .AVPlayerItemDidPlayToEndTime, object: nil)
                NotificationCenter.default.addObserver(
                    self,
                    selector: #selector(self.playerDidReachEnd),
                    name: .AVPlayerItemDidPlayToEndTime,
                    object: self.player?.currentItem
                )
                
                NotificationCenter.default.addObserver(
                    self,
                    selector: #selector(self.orientationChanged),
                    name: UIDevice.orientationDidChangeNotification,
                    object: nil
                )
                
                print("BackgroundVideo: Video setup completed successfully")
            } else {
                print("BackgroundVideo: Failed to get root view controller, falling back to window method")
                self.setupVideoWindow(layer: layer)
            }
        }
    }
    
    private func setupVideoWindow(layer: AVPlayerLayer) {
        print("BackgroundVideo: Setting up video window")
        let videoWindow = UIWindow(frame: UIScreen.main.bounds)
        videoWindow.windowLevel = UIWindow.Level.normal - 1000 // Ниже основного окна
        videoWindow.backgroundColor = UIColor.clear
        videoWindow.isUserInteractionEnabled = false
        videoWindow.isMultipleTouchEnabled = false

        // ВАЖНО: привязываем окно к активной сцене, иначе его может не быть видно на iOS 13+
        if let windowScene = UIApplication.shared.connectedScenes.first as? UIWindowScene {
            videoWindow.windowScene = windowScene
            print("BackgroundVideo: Attached video window to active UIWindowScene")
        } else {
            print("BackgroundVideo: Could not find active UIWindowScene for video window")
        }
        
        let videoViewController = UIViewController()
        videoViewController.view.backgroundColor = UIColor.clear
        videoViewController.view.isUserInteractionEnabled = false
        
        layer.frame = videoViewController.view.bounds
        videoViewController.view.layer.addSublayer(layer)
        videoWindow.rootViewController = videoViewController
        
        // Не делаем окно ключевым, чтобы не блокировать UI
        videoWindow.isHidden = false
        
        self.videoWindow = videoWindow
        self.player?.play()
        print("BackgroundVideo: Video started playing in separate window")
        
        NotificationCenter.default.removeObserver(self, name: .AVPlayerItemDidPlayToEndTime, object: nil)
        NotificationCenter.default.addObserver(
            self,
            selector: #selector(self.playerDidReachEnd),
            name: .AVPlayerItemDidPlayToEndTime,
            object: self.player?.currentItem
        )
    }
    
    @objc public func pauseVideo() {
        player?.pause()
        print("BackgroundVideo: Video paused")
    }
    
    @objc public func resumeVideo() {
        player?.play()
        print("BackgroundVideo: Video resumed")
    }
    
    @objc public func stopVideo() {
        player?.pause()
        DispatchQueue.main.async { [weak self] in
            guard let self = self else { return }
            if let windowScene = UIApplication.shared.connectedScenes.first as? UIWindowScene,
               let window = windowScene.windows.first,
               let rootViewController = window.rootViewController {
                if let existingLayer = rootViewController.view.layer.sublayers?.first(where: { $0 is AVPlayerLayer }) {
                    existingLayer.removeFromSuperlayer()
                    print("BackgroundVideo: Video layer removed from root view controller")
                }
            }
            if let videoWindow = self.videoWindow {
                videoWindow.isHidden = true
                self.videoWindow = nil
                print("BackgroundVideo: Video window removed")
            }
        }
        playerLayer?.removeFromSuperlayer()
        playerLayer = nil
        player = nil
        NotificationCenter.default.removeObserver(self, name: .AVPlayerItemDidPlayToEndTime, object: nil)
        NotificationCenter.default.removeObserver(self, name: UIDevice.orientationDidChangeNotification, object: nil)
        print("BackgroundVideo: Video stopped")
    }
    
    @objc public func setVolume(volume: Float) {
        player?.volume = max(0, min(1, volume))
        print("BackgroundVideo: Volume set to: \(volume)")
    }
    
    @objc private func playerDidReachEnd(notification: NSNotification) {
        player?.seek(to: CMTime.zero)
        player?.play()
        print("BackgroundVideo: Video looped")
    }
    
    @objc private func orientationChanged() {
        DispatchQueue.main.async { [weak self] in
            guard let self = self, let layer = self.playerLayer else { return }
            if let windowScene = UIApplication.shared.connectedScenes.first as? UIWindowScene,
               let window = windowScene.windows.first,
               let rootViewController = window.rootViewController {
                layer.frame = rootViewController.view.bounds
                print("BackgroundVideo: Layer frame updated for orientation change: \(layer.frame)")
            }
            if let videoWindow = self.videoWindow {
                videoWindow.frame = UIScreen.main.bounds
                layer.frame = videoWindow.rootViewController?.view.bounds ?? UIScreen.main.bounds
                print("BackgroundVideo: Video window frame updated for orientation change")
            }
        }
    }
}

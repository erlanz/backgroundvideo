import Foundation
import AVFoundation
import UIKit

@objc public class BackgroundVideo: NSObject {
    private var player: AVPlayer?
    private var playerLayer: AVPlayerLayer?
    
    @objc public func playVideo(path: String) {
        guard !path.isEmpty else {
            print("BackgroundVideo: No video path provided")
            return
        }
        
        // Three-branch URL resolution logic
        let url: URL
        
        if path.hasPrefix("http://") || path.hasPrefix("https://") {
            // Remote/hosted URL
            guard let remoteUrl = URL(string: path) else {
                print("BackgroundVideo: Invalid remote URL: \(path)")
                return
            }
            url = remoteUrl
        } else if path.contains("/") == false || path.hasSuffix(".mp4") || path.hasSuffix(".mov") || path.hasSuffix(".m4v") {
            // Bare resource name - resolve to bundle
            let fileName = (path as NSString).deletingPathExtension
            let fileExtension = (path as NSString).pathExtension.isEmpty ? "mp4" : (path as NSString).pathExtension
            
            guard let bundleUrl = Bundle.main.url(forResource: fileName, withExtension: fileExtension) else {
                print("BackgroundVideo: Resource not found in bundle: \(fileName).\(fileExtension)")
                return
            }
            url = bundleUrl
        } else {
            // Filesystem path
            url = URL(fileURLWithPath: path)
        }
        
        // Создаем плеер
        player = AVPlayer(url: url)
        player?.actionAtItemEnd = .none // Не останавливать по окончании
        
        // Настройка слоя с видео
        playerLayer = AVPlayerLayer(player: player)
        playerLayer?.videoGravity = .resizeAspectFill // Масштабирование на весь экран
        playerLayer?.frame = UIScreen.main.bounds
        
        // Добавляем слой на основной view контроллер
        DispatchQueue.main.async { [weak self] in
            guard let self = self, let layer = self.playerLayer else { return }
            
            // Получаем основной view контроллер
            if let windowScene = UIApplication.shared.connectedScenes.first as? UIWindowScene,
               let window = windowScene.windows.first,
               let rootViewController = window.rootViewController {
                
                // Вставляем слой на задний план
                rootViewController.view.layer.insertSublayer(layer, at: 0)
                
                // Запускаем воспроизведение
                self.player?.play()
                
                // Подписываемся на окончание воспроизведения для зацикливания
                NotificationCenter.default.addObserver(
                    self,
                    selector: #selector(self.playerDidReachEnd),
                    name: .AVPlayerItemDidPlayToEndTime,
                    object: self.player?.currentItem
                )
            }
        }
    }
    
    @objc public func pauseVideo() {
        player?.pause()
    }
    
    @objc public func resumeVideo() {
        player?.play()
    }
    
    @objc public func stopVideo() {
        player?.pause()
        playerLayer?.removeFromSuperlayer()
        playerLayer = nil
        player = nil
        
        // Удаляем наблюдатель
        NotificationCenter.default.removeObserver(self, name: .AVPlayerItemDidPlayToEndTime, object: nil)
    }
    
    @objc public func setVolume(volume: Float) {
        player?.volume = max(0, min(1, volume))
    }
    
    // Обработчик окончания видео - запускает повторное воспроизведение
    @objc private func playerDidReachEnd(notification: NSNotification) {
        player?.seek(to: CMTime.zero)
        player?.play()
    }
}

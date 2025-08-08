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
        
        print("BackgroundVideo: Creating player for path: \(path)")
        
        // Создаем URL для видео файла
        let url: URL
        
        if path.hasPrefix("http://") || path.hasPrefix("https://") {
            // Remote/hosted URL
            guard let remoteUrl = URL(string: path) else {
                print("BackgroundVideo: Invalid remote URL: \(path)")
                return
            }
            url = remoteUrl
            print("BackgroundVideo: Using remote URL: \(url)")
        } else if path.hasPrefix("/") {
            // Filesystem path
            url = URL(fileURLWithPath: path)
            print("BackgroundVideo: Using filesystem path: \(url)")
        } else {
            // Это должно быть имя ресурса - ищем в bundle
            print("BackgroundVideo: Looking for bundle resource: \(path)")
            guard let bundleUrl = Bundle.main.url(forResource: path, withExtension: "mp4") else {
                print("BackgroundVideo: Resource not found in bundle: \(path).mp4")
                return
            }
            url = bundleUrl
            print("BackgroundVideo: Found bundle resource: \(url)")
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
                print("BackgroundVideo: Video started playing")
                
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
        print("BackgroundVideo: Video paused")
    }
    
    @objc public func resumeVideo() {
        player?.play()
        print("BackgroundVideo: Video resumed")
    }
    
    @objc public func stopVideo() {
        player?.pause()
        playerLayer?.removeFromSuperlayer()
        playerLayer = nil
        player = nil
        
        // Удаляем наблюдатель
        NotificationCenter.default.removeObserver(self, name: .AVPlayerItemDidPlayToEndTime, object: nil)
        print("BackgroundVideo: Video stopped")
    }
    
    @objc public func setVolume(volume: Float) {
        player?.volume = max(0, min(1, volume))
        print("BackgroundVideo: Volume set to: \(volume)")
    }
    
    // Обработчик окончания видео - запускает повторное воспроизведение
    @objc private func playerDidReachEnd(notification: NSNotification) {
        player?.seek(to: CMTime.zero)
        player?.play()
        print("BackgroundVideo: Video looped")
    }
}

import Foundation
import AVFoundation
import UIKit

@objc public class BackgroundVideo: NSObject {
    private var player: AVPlayer?
    private var playerLayer: AVPlayerLayer?
    private var videoWindow: UIWindow?
    
    @objc public func playVideo(path: String, useWindow: Bool = true) {
        guard !path.isEmpty else {
            print("BackgroundVideo: No video path provided")
            return
        }
        
        print("BackgroundVideo: Creating player for path: \(path), useWindow: \(useWindow)")
        
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
        
        // Добавляем слой на основной view контроллер
        DispatchQueue.main.async { [weak self] in
            guard let self = self, let layer = self.playerLayer else { return }
            
            if useWindow {
                // Используем отдельное окно (рекомендуется)
                print("BackgroundVideo: Using separate window method")
                self.setupVideoWindow(layer: layer)
            } else {
                // Метод 1: Попробуем добавить на root view controller
                if let windowScene = UIApplication.shared.connectedScenes.first as? UIWindowScene,
                   let window = windowScene.windows.first,
                   let rootViewController = window.rootViewController {
                    
                    // Устанавливаем размер слоя
                    layer.frame = rootViewController.view.bounds
                    print("BackgroundVideo: Layer frame set to: \(layer.frame)")
                    
                    // Удаляем предыдущий слой если есть
                    if let existingLayer = rootViewController.view.layer.sublayers?.first(where: { $0 is AVPlayerLayer }) {
                        existingLayer.removeFromSuperlayer()
                        print("BackgroundVideo: Removed existing video layer")
                    }
                    
                    // Устанавливаем z-position для слоя (отрицательное значение = за контентом)
                    layer.zPosition = -1
                    print("BackgroundVideo: Set layer z-position to: \(layer.zPosition)")
                    
                    // Вставляем слой на задний план (индекс 0)
                    rootViewController.view.layer.insertSublayer(layer, at: 0)
                    print("BackgroundVideo: Video layer inserted at index 0")
                    
                    // Убеждаемся что слой видим
                    layer.isHidden = false
                    layer.opacity = 1.0
                    
                    // Проверяем что слой действительно добавлен
                    if rootViewController.view.layer.sublayers?.contains(layer) == true {
                        print("BackgroundVideo: Layer successfully added to view hierarchy")
                    } else {
                        print("BackgroundVideo: Failed to add layer to view hierarchy")
                    }
                    
                    // Запускаем воспроизведение
                    self.player?.play()
                    print("BackgroundVideo: Video started playing")
                    
                    // Подписываемся на окончание воспроизведения для зацикливания
                    NotificationCenter.default.removeObserver(self, name: .AVPlayerItemDidPlayToEndTime, object: nil)
                    NotificationCenter.default.addObserver(
                        self,
                        selector: #selector(self.playerDidReachEnd),
                        name: .AVPlayerItemDidPlayToEndTime,
                        object: self.player?.currentItem
                    )
                    
                    // Добавляем наблюдатель за изменением размера экрана
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
    }
    
    private func setupVideoWindow(layer: AVPlayerLayer) {
        // Метод 2: Создаем отдельное окно для видео
        print("BackgroundVideo: Setting up video window")
        
        // Создаем новое окно
        let videoWindow = UIWindow(frame: UIScreen.main.bounds)
        videoWindow.windowLevel = UIWindow.Level.normal - 1 // Ниже нормального уровня
        videoWindow.backgroundColor = UIColor.clear
        videoWindow.isUserInteractionEnabled = false // Отключаем взаимодействие с окном
        videoWindow.isMultipleTouchEnabled = false
        
        // Создаем view controller для окна
        let videoViewController = UIViewController()
        videoViewController.view.backgroundColor = UIColor.clear
        videoViewController.view.isUserInteractionEnabled = false // Отключаем взаимодействие с view
        
        // Устанавливаем размер слоя
        layer.frame = videoViewController.view.bounds
        
        // Добавляем слой на view controller
        videoViewController.view.layer.addSublayer(layer)
        
        // Устанавливаем view controller как root для окна
        videoWindow.rootViewController = videoViewController
        
        // Показываем окно
        videoWindow.isHidden = false
        videoWindow.makeKeyAndVisible()
        
        // Сохраняем ссылку на окно
        self.videoWindow = videoWindow
        
        // Запускаем воспроизведение
        self.player?.play()
        print("BackgroundVideo: Video started playing in separate window")
        
        // Подписываемся на окончание воспроизведения для зацикливания
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
        
        // Удаляем слой
        DispatchQueue.main.async { [weak self] in
            guard let self = self else { return }
            
            // Удаляем из root view controller
            if let windowScene = UIApplication.shared.connectedScenes.first as? UIWindowScene,
               let window = windowScene.windows.first,
               let rootViewController = window.rootViewController {
                
                // Удаляем слой видео
                if let existingLayer = rootViewController.view.layer.sublayers?.first(where: { $0 is AVPlayerLayer }) {
                    existingLayer.removeFromSuperlayer()
                    print("BackgroundVideo: Video layer removed from root view controller")
                }
            }
            
            // Удаляем отдельное окно если есть
            if let videoWindow = self.videoWindow {
                videoWindow.isHidden = true
                self.videoWindow = nil
                print("BackgroundVideo: Video window removed")
            }
        }
        
        playerLayer?.removeFromSuperlayer()
        playerLayer = nil
        player = nil
        
        // Удаляем наблюдатели
        NotificationCenter.default.removeObserver(self, name: .AVPlayerItemDidPlayToEndTime, object: nil)
        NotificationCenter.default.removeObserver(self, name: UIDevice.orientationDidChangeNotification, object: nil)
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
    
    // Обработчик изменения ориентации экрана
    @objc private func orientationChanged() {
        DispatchQueue.main.async { [weak self] in
            guard let self = self, let layer = self.playerLayer else { return }
            
            // Обновляем размер в root view controller
            if let windowScene = UIApplication.shared.connectedScenes.first as? UIWindowScene,
               let window = windowScene.windows.first,
               let rootViewController = window.rootViewController {
                
                layer.frame = rootViewController.view.bounds
                print("BackgroundVideo: Layer frame updated for orientation change: \(layer.frame)")
            }
            
            // Обновляем размер в отдельном окне
            if let videoWindow = self.videoWindow {
                videoWindow.frame = UIScreen.main.bounds
                layer.frame = videoWindow.rootViewController?.view.bounds ?? UIScreen.main.bounds
                print("BackgroundVideo: Video window frame updated for orientation change")
            }
        }
    }
}

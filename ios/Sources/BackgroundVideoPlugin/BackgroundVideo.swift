import Foundation

@objc public class BackgroundVideo: NSObject {
    @objc public func echo(_ value: String) -> String {
        print(value)
        return value
    }
}

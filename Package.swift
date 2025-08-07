// swift-tools-version: 5.9
import PackageDescription

let package = Package(
    name: "Backgroundvideo",
    platforms: [.iOS(.v13)],
    products: [
        .library(
            name: "Backgroundvideo",
            targets: ["BackgroundVideoPlugin"])
    ],
    dependencies: [
        .package(url: "https://github.com/ionic-team/capacitor-swift-pm.git", from: "7.0.0")
    ],
    targets: [
        .target(
            name: "BackgroundVideoPlugin",
            dependencies: [
                .product(name: "Capacitor", package: "capacitor-swift-pm"),
                .product(name: "Cordova", package: "capacitor-swift-pm")
            ],
            path: "ios/Sources/BackgroundVideoPlugin"),
        .testTarget(
            name: "BackgroundVideoPluginTests",
            dependencies: ["BackgroundVideoPlugin"],
            path: "ios/Tests/BackgroundVideoPluginTests")
    ]
)
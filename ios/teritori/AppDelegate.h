<<<<<<< HEAD
#import <RCTAppDelegate.h>
#import <UIKit/UIKit.h>
#import <Expo/Expo.h>

@interface AppDelegate : EXAppDelegateWrapper
=======
#import <Foundation/Foundation.h>
#import <React/RCTBridgeDelegate.h>
#import <UIKit/UIKit.h>

#import <Expo/Expo.h>

@interface AppDelegate : EXAppDelegateWrapper <RCTBridgeDelegate>
>>>>>>> 6e7a3c36 (weshnet ios integration)

@end

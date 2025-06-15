//
//  ReminderNotificationManager.m
//  TheSimpsonPlaceReact
//
//  Created by Carlos C on 15/6/25.
//

#import "ReminderNotificationManager.h"
#import <UserNotifications/UserNotifications.h>

@implementation ReminderNotificationManager

RCT_EXPORT_MODULE();

RCT_EXPORT_METHOD(scheduleNotification:(NSString *)title
                  body:(NSString *)body
                  delayInSeconds:(nonnull NSNumber *)delay
                  resolver:(RCTPromiseResolveBlock)resolve
                  rejecter:(RCTPromiseRejectBlock)reject)
{
  UNUserNotificationCenter *center = [UNUserNotificationCenter currentNotificationCenter];

  UNAuthorizationOptions options = UNAuthorizationOptionAlert + UNAuthorizationOptionSound;

  [center requestAuthorizationWithOptions:options
                        completionHandler:^(BOOL granted, NSError * _Nullable error) {
    if (!granted || error != nil) {
      reject(@"notification_error", @"Permiso denegado o error", error);
      return;
    }

    UNMutableNotificationContent *content = [[UNMutableNotificationContent alloc] init];
    content.title = title;
    content.body = body;
    content.sound = [UNNotificationSound defaultSound];

    NSTimeInterval interval = [delay doubleValue];
    UNTimeIntervalNotificationTrigger *trigger = [UNTimeIntervalNotificationTrigger triggerWithTimeInterval:interval repeats:NO];

    NSString *identifier = [[NSUUID UUID] UUIDString];
    UNNotificationRequest *request = [UNNotificationRequest requestWithIdentifier:identifier content:content trigger:trigger];

    [center addNotificationRequest:request withCompletionHandler:^(NSError * _Nullable error) {
      if (error != nil) {
        reject(@"notification_error", @"Error al programar la notificación", error);
      } else {
        resolve(@"Notificación programada");
      }
    }];
  }];
}

@end

#import "NSURLSessionConfiguration+Cookie.h"
#import <objc/runtime.h>
#import "NSObject+DTRuntime.h"

@implementation NSURLSessionConfiguration (Cookie)

+ (void)load {
  static dispatch_once_t onceToken;
  dispatch_once(&onceToken, ^{
    [[self class] swizzleClassMethod:@selector(defaultSessionConfiguration)
                          withMethod:@selector(__swizzle_defaultSessionConfiguration)];
  });
}

+ (NSURLSessionConfiguration*) __swizzle_defaultSessionConfiguration {
  NSURLSessionConfiguration * sessionConfig = [NSURLSessionConfiguration __swizzle_defaultSessionConfiguration];
  
  NSArray<NSString*>* stack = [NSThread callStackSymbols];
  if ([stack count] > 1 && [stack[1] containsString:@"Mapbox"]) {
    sessionConfig.HTTPCookieStorage = [NSHTTPCookieStorage sharedHTTPCookieStorage];
    
    sessionConfig.HTTPShouldSetCookies = YES;
  }
  
  return sessionConfig;
}

@end

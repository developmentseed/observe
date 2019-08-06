package com.developmentseed.observe;

import android.content.pm.ApplicationInfo;
import android.os.Bundle;
import android.webkit.WebView;

import com.developmentseed.observe.BuildConfig;
import com.facebook.react.ReactActivity;
import com.facebook.react.ReactActivityDelegate;
import com.facebook.react.ReactRootView;
import com.facebook.react.ReactInstanceManager;
import com.facebook.react.bridge.ReactContext;
import com.facebook.react.modules.network.CookieJarContainer;
import com.facebook.react.modules.network.ForwardingCookieHandler;
import com.facebook.react.modules.network.OkHttpClientFactory;
import com.facebook.react.modules.network.OkHttpClientProvider;
import com.facebook.react.modules.network.ReactCookieJarContainer;
import com.mapbox.mapboxsdk.module.http.HttpRequestUtil;
import com.swmansion.gesturehandler.react.RNGestureHandlerEnabledRootView;

import java.io.IOException;
import java.net.CookieHandler;

import okhttp3.CookieJar;
import okhttp3.Dispatcher;
import okhttp3.Interceptor;
import okhttp3.JavaNetCookieJar;
import okhttp3.OkHttpClient;
import okhttp3.Request;
import okhttp3.Response;

import com.facebook.react.bridge.ReactApplicationContext;
import com.mapbox.mapboxsdk.Mapbox;

public class MainActivity extends ReactActivity {
    private static final String TAG = "Observe";
    private static final String accessToken = BuildConfig.MAPBOX_ACCESS_TOKEN;

    /**
     * Returns the name of the main component registered from JavaScript.
     * This is used to schedule rendering of the component.
     */
    @Override
    protected String getMainComponentName() {
        return "Observe";
    }

    @Override
    protected ReactActivityDelegate createReactActivityDelegate() {
        return new ReactActivityDelegate(this, getMainComponentName()) {
            @Override
            protected ReactRootView createRootView() {
                return new RNGestureHandlerEnabledRootView(MainActivity.this);
            }
        };
    }

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        // Added this snippet to enable WebView debugging
        // https://stackoverflow.com/a/53225083
        //
        // Using conditionals to detect whether app is in debug mode
        // https://developers.google.com/web/tools/chrome-devtools/remote-debugging/webviews
        if (0 != (getApplicationInfo().flags & ApplicationInfo.FLAG_DEBUGGABLE)) {
            WebView.setWebContentsDebuggingEnabled(true);
        }

        ReactInstanceManager mReactInstanceManager = getReactNativeHost().getReactInstanceManager();
        ReactApplicationContext context = (ReactApplicationContext) mReactInstanceManager.getCurrentReactContext();
        mReactInstanceManager.addReactInstanceEventListener(new ReactInstanceManager.ReactInstanceEventListener() {
            public void onReactContextInitialized(ReactContext validContext) {
                CookieHandler cookieHandler = new ForwardingCookieHandler(validContext);

                // Builder's cookieJar must be a ReactNativeCookieJarContainer
                final CookieJarContainer emptyCookieJarContainer = new ReactCookieJarContainer();
                emptyCookieJarContainer.setCookieJar(CookieJar.NO_COOKIES);

                OkHttpClientProvider.setOkHttpClientFactory(new OkHttpClientFactory() {
                    @Override
                    public OkHttpClient createNewNetworkModuleClient() {
                        return new OkHttpClient.Builder()
                                .addNetworkInterceptor(new Interceptor() {
                                    @Override
                                    public Response intercept(Chain chain) throws IOException {
                                        Request request = chain.request()
                                                .newBuilder()
                                                .addHeader("Connection", "close")
                                                .build();

                                        return chain.proceed(request);
                                    }
                                })
                                // using a ReactCookieJarContainer wrapping cookieJarContainer doesn't
                                // actually provide cookies (and one must be required, since the default
                                // can't be cast)
                                .cookieJar(emptyCookieJarContainer)
                                .build();
                    }
                });

                Mapbox.getInstance(validContext, accessToken);
                HttpRequestUtil.setOkHttpClient(
                        new OkHttpClient.Builder()
                                .cookieJar(new ReadOnlyJavaNetCookieJar(cookieHandler))
                                // match MapboxGL's dispatcher options
                                .dispatcher(getDispatcher())
                                .build());
            }
        });
    }

    private static Dispatcher getDispatcher() {
        Dispatcher dispatcher = new Dispatcher();
        // Matches core limit set on
        // https://github.com/mapbox/mapbox-gl-native/blob/master/platform/android/src/http_file_source.cpp#L192
        dispatcher.setMaxRequestsPerHost(20);
        return dispatcher;
    }
}

package com.unigo.companion;

import android.Manifest;
import android.content.pm.PackageManager;
import android.os.Bundle;
import android.webkit.GeolocationPermissions;
import android.webkit.WebChromeClient;
import android.webkit.WebSettings;
import android.webkit.WebView;
import android.webkit.WebViewClient;
import android.widget.Toast;
import androidx.annotation.NonNull;
import androidx.appcompat.app.AppCompatActivity;
import androidx.core.app.ActivityCompat;
import androidx.core.content.ContextCompat;
import androidx.swiperefreshlayout.widget.SwipeRefreshLayout;

/**
 * Main activity that hosts the WebView displaying the UniGo website
 */
public class MainActivity extends AppCompatActivity {

    private static final String WEBSITE_URL = "https://uni-go-companion-finder-omega.vercel.app/";
    private static final int LOCATION_PERMISSION_REQUEST_CODE = 100;
    
    private WebView webView;
    private SwipeRefreshLayout swipeRefreshLayout;
    private String geolocationOrigin;
    private GeolocationPermissions.Callback geolocationCallback;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);

        // Initialize views
        webView = findViewById(R.id.webView);
        swipeRefreshLayout = findViewById(R.id.swipeRefresh);

        // Configure WebView
        setupWebView();

        // Setup swipe-to-refresh
        setupSwipeRefresh();

        // Load website
        webView.loadUrl(WEBSITE_URL);

        // Request location permissions
        requestLocationPermissions();
    }

    private void setupWebView() {
        WebSettings webSettings = webView.getSettings();
        
        // Enable JavaScript (required for modern web apps)
        webSettings.setJavaScriptEnabled(true);
        
        // Enable DOM storage (for web app data)
        webSettings.setDomStorageEnabled(true);
        
        // Enable database storage
        webSettings.setDatabaseEnabled(true);
        
        // Enable geolocation
        webSettings.setGeolocationEnabled(true);
        
        // Enable zoom controls
        webSettings.setBuiltInZoomControls(true);
        webSettings.setDisplayZoomControls(false);
        
        // Enable responsive layout
        webSettings.setUseWideViewPort(true);
        webSettings.setLoadWithOverviewMode(true);
        
        // Enable caching for better performance
        webSettings.setCacheMode(WebSettings.LOAD_DEFAULT);
        webSettings.setAppCacheEnabled(true);
        
        // Set user agent to mobile
        webSettings.setUserAgentString(webSettings.getUserAgentString());

        // WebViewClient to handle page navigation
        webView.setWebViewClient(new WebViewClient() {
            @Override
            public void onPageFinished(WebView view, String url) {
                super.onPageFinished(view, url);
                swipeRefreshLayout.setRefreshing(false);
            }

            @Override
            public void onReceivedError(WebView view, int errorCode, String description, String failingUrl) {
                super.onReceivedError(view, errorCode, description, failingUrl);
                // Load custom error page
                view.loadUrl("file:///android_asset/error.html");
                Toast.makeText(MainActivity.this, "No internet connection", Toast.LENGTH_SHORT).show();
            }
        });

        // WebChromeClient to handle geolocation and other features
        webView.setWebChromeClient(new WebChromeClient() {
            @Override
            public void onGeolocationPermissionsShowPrompt(String origin, GeolocationPermissions.Callback callback) {
                // Store for later use after permission is granted
                geolocationOrigin = origin;
                geolocationCallback = callback;
                
                // Check if we have location permission
                if (ContextCompat.checkSelfPermission(MainActivity.this, 
                        Manifest.permission.ACCESS_FINE_LOCATION) == PackageManager.PERMISSION_GRANTED) {
                    callback.invoke(origin, true, false);
                } else {
                    requestLocationPermissions();
                }
            }
        });
    }

    private void setupSwipeRefresh() {
        swipeRefreshLayout.setOnRefreshListener(new SwipeRefreshLayout.OnRefreshListener() {
            @Override
            public void onRefresh() {
                webView.reload();
            }
        });
        
        // Set color scheme
        swipeRefreshLayout.setColorSchemeResources(
            R.color.primary,
            R.color.primary_dark,
            R.color.accent
        );
    }

    private void requestLocationPermissions() {
        if (ContextCompat.checkSelfPermission(this, Manifest.permission.ACCESS_FINE_LOCATION)
                != PackageManager.PERMISSION_GRANTED) {
            ActivityCompat.requestPermissions(this,
                    new String[]{
                        Manifest.permission.ACCESS_FINE_LOCATION,
                        Manifest.permission.ACCESS_COARSE_LOCATION
                    },
                    LOCATION_PERMISSION_REQUEST_CODE);
        }
    }

    @Override
    public void onRequestPermissionsResult(int requestCode, @NonNull String[] permissions, 
                                          @NonNull int[] grantResults) {
        super.onRequestPermissionsResult(requestCode, permissions, grantResults);
        
        if (requestCode == LOCATION_PERMISSION_REQUEST_CODE) {
            if (grantResults.length > 0 && grantResults[0] == PackageManager.PERMISSION_GRANTED) {
                // Permission granted, notify the geolocation callback if waiting
                if (geolocationCallback != null && geolocationOrigin != null) {
                    geolocationCallback.invoke(geolocationOrigin, true, false);
                }
                Toast.makeText(this, "Location permission granted", Toast.LENGTH_SHORT).show();
            } else {
                // Permission denied
                if (geolocationCallback != null && geolocationOrigin != null) {
                    geolocationCallback.invoke(geolocationOrigin, false, false);
                }
                Toast.makeText(this, "Location permission denied. Maps features may not work.", 
                             Toast.LENGTH_LONG).show();
            }
        }
    }

    @Override
    public void onBackPressed() {
        // Handle back button to navigate WebView history
        if (webView.canGoBack()) {
            webView.goBack();
        } else {
            super.onBackPressed();
        }
    }

    @Override
    protected void onDestroy() {
        super.onDestroy();
        if (webView != null) {
            webView.destroy();
        }
    }
}

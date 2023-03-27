# @kinde-oss/react-native-sdk

React Native Client for `@kinde-oss/react-native-sdk`
Provides endpoints to manage your Kinde Businesses

> Functions/methods targeting the Management API can only be accessed with tokens generated by the Client Credentials Auth flow at the moment. Since this SDK does not support the Client Credential flow, Management API functions are not available for use. In the future, tokens obtained via other flows would also be able to access the management API functions/methods.

We only support the recommended [Authorization Code Flow with PKCE](https://oauth.net/2/pkce/).
For more information, please visit [https://kinde.com/docs](https://kinde.com/docs)

## Support versions

-   React Native: We support React Native versions 0.60 and higher. To use this package with older versions of React Native, please visit [react-native-sdk-0-5x](https://github.com/kinde-oss/react-native-sdk-0-5x)
-   Expo

## Installing dependencies

You will need Node, the React Native command line interface, a JDK, Android Studio (for Android) and Xcode (for iOS).

Follow [the installation instructions for your chosen OS](https://reactnative.dev/docs/environment-setup) to install dependencies;

## Installation

The SDK can be installed with `npm` or `yarn` but we will use `npm` for code samples.

```shell
npm install @kinde-oss/react-native-sdk --save
```

### Android

Checking `MainApplication.java` to verify the `react-native-keychain` was added. If not, you need to install manually:

-   Edit `android/settings.gradle`

```java
...

include ':react-native-keychain'
project(':react-native-keychain').projectDir = new File(rootProject.projectDir, '../node_modules/react-native-keychain/android')

...
```

-   Edit `android/app/build.gradle`

```java
apply plugin: 'com.android.application'

android {
  ...
}

dependencies {
  ...

  implementation project(':react-native-keychain')

  ...
}
```

-   Edit your `MainApplication.java`

```java
...

import com.oblador.keychain.KeychainPackage;

...

public class MainActivity extends extends ReactActivity {
  ...
  @Override
  protected List<ReactPackage> getPackages() {
      return Arrays.<ReactPackage>asList(
              new MainReactPackage(),
              new KeychainPackage()
      );
  }

  // or
  @Override
  protected List<ReactPackage> getPackages() {
    @SuppressWarnings("UnnecessaryLocalVariable")
    List<ReactPackage> packages = new PackageList(this).getPackages();
    packages.add(new KeychainPackage());
    return packages;
  }
  ...
}
...
```

#### iOS

You need to updating iOS native dependencies by **CocoaPods**. We recommend installing **CocoaPods** using [Homebrew](https://brew.sh/)

```shell
# Install CocoaPods via brew
brew install cocoapods

# Install iOS native dependencies
cd ios && pod install
```

If the `react-native-keychain` not linked, you need to install manually

##### Option: With CocoaPods (High recommended)

Add the following to your `Podfile` and run pod update:

```Swift
pod 'RNKeychain', :path => '../node_modules/react-native-keychain'
```

##### Option: Manually

-   Click to `Build Phases` tab
-   Choose `Link Binary With Libraries`
-   Click `+` in bottom
-   **Add Other...** => **Add Files...** => **node_modules/react-native-keychain/RNKeychain.xcodeproj**
-   Then, you need to add `libRNKeychain.a`
-   Clean and rebuild

##### Enable `Keychain Sharing` entitlement for iOS 10+

For iOS 10 you'll need to enable the `Keychain Sharing` entitlement in the `Capabilities` section of your build target
![screenshot](./assets/image.png)

## Getting Started

### Kinde configuration

On the Kinde web app navigate to `Settings` in the left menu, then select `Applications` and select the `Frontend app`. Scroll down to the `Callback URLs` section.

Here you want to put in the callback URLs for your React Native app, which should look something like this:

-   Allowed callback URLs - `myapp://myhost.kinde.com/kinde_callback`
-   Allowed logout redirect URLs - `myapp://myhost.kinde.com/kinde_callback`

Make sure you press the Save button at the bottom of the page!

Note: The `myapp://myhost.kinde.com/kinde_callback` is used as an example of local URL Scheme, change to the local local URL Scheme that you use.

### Environments

If you would like to use our Environments feature as part of your development process. You will need to create them first within your Kinde account. In this case you would use the Environment subdomain in the code block above.

### Configuring your app

#### Environment variables

Put these variables in your .env file. You can find these variables on the same page as where you set the callback URLs.

-   `KINDE_ISSUER_URL` - your Kinde domain
-   `KINDE_POST_CALLBACK_URL` - After the user authenticates we will callback to this address. Make sure this URL is under your allowed callback URLs
-   `KINDE_POST_LOGOUT_REDIRECT_URL` - where you want users to be redirected to after logging out. Make sure this URL is under your allowed logout redirect URLs
-   `KINDE_CLIENT_ID` - you can find this on the App Keys page

```javascript
KINDE_ISSUER_URL=https://your_kinde_domain.kinde.com
KINDE_POST_CALLBACK_URL=myapp://your_kinde_domain.kinde.com/kinde_callback
KINDE_POST_LOGOUT_REDIRECT_URL=myapp://your_kinde_domain.kinde.com/kinde_callback
KINDE_CLIENT_ID=your_kinde_client_id
```

### Configuration Deep link

#### With React Native

If your app was launched from an external url registered to your app you can access and handle it from any component you want with:

```javascript
...
import { ..., Linking, Platform, ... } from 'react-native';
...
useEffect(() => {
  Linking.getInitialURL()
    .then((url) => {
      if (url) {
        // Your code here
      }
    })
    .catch((err) => console.error("An error occurred", err));

  Linking.addEventListener('url', (event) => {
    if (event.url) {
      // Your code here
    }
  })
}, []);
```

##### iOS

On iOS, you'll need to link `RCTLinking` to your project by following the steps described here. If you also want to listen to incoming app links during your app's execution, you'll need to add the following lines to your `AppDelegate.m`

```swift
// iOS 9.x or newer
#import <React/RCTLinkingManager.h>

- (BOOL)application:(UIApplication *)application
   openURL:(NSURL *)url
   options:(NSDictionary<UIApplicationOpenURLOptionsKey,id> *)options
{
  return [RCTLinkingManager application:application openURL:url options:options];
}
```

If you're targeting iOS 8.x or older, you can use the following code instead:

```swift
// iOS 8.x or older
#import <React/RCTLinkingManager.h>

- (BOOL)application:(UIApplication *)application openURL:(NSURL *)url
  sourceApplication:(NSString *)sourceApplication annotation:(id)annotation
{
  return [RCTLinkingManager application:application openURL:url
                      sourceApplication:sourceApplication annotation:annotation];
}
```

Please make sure you have configuration URL scheme in `Info.plist`, so app can be opened by deep link:

```swift
...
<key>CFBundleURLTypes</key>
<array>
  <dict>
    <key>CFBundleTypeRole</key>
    <string>Editor</string>
    <key>CFBundleURLName</key>
    <string>myapp</string> // you can change it
    <key>CFBundleURLSchemes</key>
    <array>
      <string>myapp</string> // you can change it
    </array>
  </dict>
</array>
...
```

##### Android

Open `AndroidManifest.xml` and update your scheme:

```xml
<intent-filter>
    <action android:name="android.intent.action.VIEW" />
    <category android:name="android.intent.category.DEFAULT" />
    <category android:name="android.intent.category.BROWSABLE" />
    <data android:scheme="myapp" android:host="your_kinde_issuer.kinde.com" />  // you can change it
</intent-filter>
```

#### With Expo

#### Linking to your app

To link to your [development](https://docs.expo.dev/development/introduction/) build or standalone app, you need to specify a custom URL scheme for your app. You can register a scheme in your Expo config (**app.json**, **app.config.js**) by adding a string under the `scheme` key:

```json
{
  "expo": {
    "scheme": "myapp",
    ...
  }
}
```

#### Linking to Expo Go

[Expo Go](https://expo.dev/expo-go) uses the `exp://` scheme, however, if we link to `exp://` without any address afterward, it will open the app to the home screen.

In development, your app will live at a url like `exp://127.0.0.1:19000`. When published, an experience will be hosted at a URL like ` exp://u.expo.dev/[project-id]?channel-name=[channel-name]&runtime-version=[runtime-version]`, where `u.expo.dev/[project-id]` is the hosted URL that Expo Go fetches from.
**Note**: You also should update your callback url to both your app and Kinde:

```javascript
KINDE_ISSUER_URL=https://your_kinde_domain.kinde.com
KINDE_POST_CALLBACK_URL=exp://your_machine_ip:your_machine_port // f.e: exp://127.0.0.1:19000
KINDE_POST_LOGOUT_REDIRECT_URL=exp://your_machine_ip:your_machine_port // f.e: exp://127.0.0.1:19000
KINDE_CLIENT_ID=your_kinde_client_id
```

### Integration your app

You’ll need to create a new instance of the Kinde Auth client object. Please execute this code below:

```javascript
...
import { KindeSDK } from '@kinde-oss/react-native-sdk';
...

...
const client = new KindeSDK(YOUR_KINDE_ISSUER, YOUR_KINDE_REDIRECT_URI, YOUR_KINDE_CLIENT_ID, YOUR_KINDE_LOGOUT_REDIRECT_URI);
...
```

### Login / Register

The Kinde client provides methods for an easy to implement login / register flow.
As an example if you add buttons in your render as follows:

```javascript
<View>
    <View>
        <Button title="Sign In" onPress={handleSignIn} />
    </View>
    <View>
        <Button title="Sign Up" color="#000" onPress={handleSignUp} />
    </View>
</View>
```

Then define new functions that match for each button:
**\*Note**: Make sure you've already defined KindeSDK as `client`\*

```javascript
...
const handleSignUp = () => {
  client.register();
};

const handleSignIn = () => {
  client.login();
};
...
```

### Handle redirect

#### With React Native

Once your user is redirected back to your app from Kinde, using the `getToken` method to get token instance from Kinde

```javascript
const handleCallback = async (url: string) => {
    const token = await client.getToken(url);
    console.log('token here', token);
};

useEffect(() => {
    Linking.getInitialURL()
        .then((url) => {
            if (url) {
                handleCallback(url);
            }
        })
        .catch((err) => console.error('An error occurred', err));

    Linking.addEventListener('url', (event) => {
        if (event.url) {
            handleCallback(event.url);
        }
    });
}, []);
```

You can also get the current authentication status with `AuthStatus`:

```javascript
...
import {..., AuthStatus ,...} from '@kinde-oss/react-native-sdk';
...

const handleCallback = async (url: string) => {
  if (client.authStatus !== AuthStatus.UNAUTHENTICATED) {
    const token = await client.getToken(url);
    console.log('token here', token);
  }
};
```

Or simply use `isAuthenticated` from the SDK to determine whether the user is authenticated or not:

```javascript
const handleCallback = async (url: string) => {
    if (client.isAuthenticated) {
        const token = await client.getToken(url);
        console.log('token here', token);
    }
};
```

#### With Expo

You must install `expo-linking`. This provides utilities for your app to interact with other installed apps using deep links. It also provides helper methods for constructing and parsing deep links into your app. This module is an extension of the React Native [Linking](https://reactnative.dev/docs/linking.html) module.

```javascript
...
import * as Linking from "expo-linking";
...

const client = new KindeSDK(
  YOUR_KINDE_ISSUER,
  YOUR_KINDE_REDIRECT_URI,
  YOUR_KINDE_CLIENT_ID,
  YOUR_KINDE_LOGOUT_REDIRECT_URI
)

const url = Linking.useURL();

useEffect(() => {
  if (url) {
    handleCallback(url);
  }
}, [url]);

const handleCallback = async (url) => {
  const token = await client.getToken(url);
  console.log('token here', token);
}
```

### Logout

This is implemented in much the same way as logging in or registering. The Kinde SPA client comes with a logout method

```javascript
const handleLogout = () => {
    client.logout();
};
```

### Get user information

**\*Note warning:** Before you call the API, please make sure that you've already authenticated. If not, errors will appear there.\*

To access the user information, use the `OAuthApi`, `ApiClient` classes exported from `@kinde-oss/react-native-sdk`, then call the `getUser` method of `OAuthApi` instance

```javascript
...
import { ..., OAuthApi, ApiClient, ... } from '@kinde-oss/react-native-sdk';
...

const getUserProfile = () => {
  const config = new ApiClient.Configuration({
    basePath: KINDE_ISSUER_URL,
  });
  const apiInstance = new OAuthApi(config)
  const data = await apiInstance.getUser();
  console.log('API called successfully. Returned data: ' + data);
}
```

### View users in Kinde

If you navigate to the "Users" page within Kinde you will see your newly registered user there. 🚀

### User Permissions

Once a user has been verified as login in, your product/application will be returned the JWT token with an array of permissions for that user. You will need to configure your product/application to read permissions and unlock the respective functions.

You set Permissions in your Kinde account (see help article), the below is an example set of permissions.

```javascript
const permissions = [
    'create:todos',
    'update:todos',
    'read:todos',
    'delete:todos',
    'create:tasks',
    'update:tasks',
    'read:tasks',
    'delete:tasks'
];
```

We provide helper functions to more easily access permissions:

```javascript
client.getPermission('create:todos');
// {orgCode: "org_1234", isGranted: true}

client.getPermissions();
// {orgCode: "org_1234", permissions: ["create:todos", "update:todos", "read:todos"]}
```

A practical example in code might look something like:

```
if (client.getPermission("create:todos").isGranted) {
    // show Create Todo button in UI
}
```

### Audience

An `audience` is the intended recipient of an access token - for example the API for your application. The audience argument can be passed to the Kinde client to request an audience be added to the provided token.

The audience of a token is the intended recipient of the token.

```javascript
const client = new KindeSDK(
    YOUR_KINDE_ISSUER,
    YOUR_KINDE_REDIRECT_URI,
    YOUR_KINDE_CLIENT_ID,
    YOUR_KINDE_LOGOUT_REDIRECT_URI,
    YOUR_SCOPES,
    {
        audience: 'api.yourapp.com'
    }
);
```

For details on how to connect, see [Register an API](https://kinde.com/docs/developer-tools/register-an-api/)

### Overriding scope

By default the KindeSDK SDK requests the following scopes:

-   profile
-   email
-   offline
-   openid

You can override this by passing scope into the KindeSDK

```javascript
const client = new KindeSDK(
    YOUR_KINDE_ISSUER,
    YOUR_KINDE_REDIRECT_URI,
    YOUR_KINDE_CLIENT_ID,
    YOUR_KINDE_LOGOUT_REDIRECT_URI,
    'profile email offline openid'
);
```

### Getting claims

We have provided a helper to grab any claim from your id or access tokens. The helper defaults to access tokens:

```javascript
client.getClaim('aud');
// ["api.yourapp.com"]

client.getClaim('given_name', 'id_token');
// "David"
```

### Organizations Control

#### Create an organization

To have a new organization created within your application, you will need to run a similar function to below:

```javascript
<Button title="Create Organization" onPress={handleCreateOrg} />
```

Then define new function that match for button:
**\*Note**: Make sure you've already defined KindeSDK as `client` in the state\*

```javascript
const handleCreateOrg = () => {
  client.createOrg();
}

// You can also pass `org_name` as your organization
client.createOrg({org_name: 'Your Organization'});
...
```

#### Sign in and sign up to organizations

Kinde has a unique code for every organization. You’ll have to pass this code through when you register a new user. Example function below:

```javascript
client.register({ org_code: 'your_org_code' });
```

If you want a user to sign in into a particular organization, pass this code along with the sign in method.

```javascript
client.login({ org_code: 'your_org_code' });
```

Following authentication, Kinde provides a json web token (jwt) to your application. Along with the standard information we also include the org_code and the permissions for that organization (this is important as a user can belong to multiple organizations and have different permissions for each). Example of a returned token:

```json
{
    "aud": [],
    "exp": 1658475930,
    "iat": 1658472329,
    "iss": "https://your_subdomain.kinde.com",
    "jti": "123457890",
    "org_code": "org_1234",
    "permissions": ["read:todos", "create:todos"],
    "scp": ["openid", "profile", "email", "offline"],
    "sub": "kp:123457890"
}
```

The `id_token` will also contain an array of Organizations that a user belongs to - this is useful if you wanted to build out an organization switcher for example.

```json
{
  ...
  "org_codes": ["org_1234", "org_4567"]
  ...
}
```

There are two helper functions you can use to extract information:

```javascript
client.getOrganization();
// {orgCode: "org_1234"}

client.getUserOrganizations();
// {orgCodes: ["org_1234", "org_abcd"]}
```

## Token Storage

Once the user has successfully authenticated, you'll have a JWT and possibly a refresh token that should be stored securely.

Recommendations on secure token storage can be found [here](https://reactnative.dev/docs/security#storing-sensitive-info).

## How to run test

The simplest way to run the JavaScript test suite is by using the following command at the root of your React Native checkout:

```bash
npm test
```

_Note: Ensure you have already run `npm install` before_

## SDK API Reference

| Property                        | Type    | Is required | Default                      | Description                                                                                                       |
| ------------------------------- | ------- | ----------- | ---------------------------- | ----------------------------------------------------------------------------------------------------------------- |
| issuer                          | string  | Yes         |                              | Either your Kinde instance url or your custom domain. e.g [https://yourapp.kinde.com](https://yourapp.kinde.com/) |
| redirectUri                     | string  | Yes         |                              | The url that the user will be returned to after authentication                                                    |
| clientId                        | string  | Yes         |                              | The id of your application - get this from the Kinde admin area                                                   |
| logoutRedirectUri               | string  | No          |                              | Where your user will be redirected upon logout                                                                    |
| scope                           | boolean | No          | openid profile email offline | The scopes to be requested from Kinde                                                                             |
| additionalParameters            | object  | No          | {}                           | Additional parameters that will be passed in the authorization request                                            |
| additionalParameters - audience | string  | No          |                              | The audience claim for the JWT                                                                                    |

## KindeSDK methods

| Property             | Description                                                                                       | Arguments                           | Usage                                                                                                                                                                     | Sample output                                                                                                                                                                                                                |
| -------------------- | ------------------------------------------------------------------------------------------------- | ----------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| login                | Constructs redirect url and sends user to Kinde to sign in                                        | {<br>org_code?: string<br>}         | kinde.login(); or<br>kinde.login({org_code: 'your organization code'}) // Allow org_code to be provided if a specific org is to be signed up into.                        |                                                                                                                                                                                                                              |
| register             | Constructs redirect url and sends user to Kinde to sign up                                        | {<br>org_code?: string<br>}         | kinde.register(); or<br>kinde.register({org_code: 'your organization code'}) // Allow org_code to be provided if a specific org is to be registered into.                 |                                                                                                                                                                                                                              |
| logout               | Logs the user out of Kinde                                                                        |                                     | kinde.logout();                                                                                                                                                           |                                                                                                                                                                                                                              |
| getToken             | Returns the raw Access token from URL after logged from Kinde                                     | url?: string                        | kinde.getToken(url); or<br>kinde.getToken(); //  In this case, you have already authenticated before. Otherwise, an error will be thrown in here                          | {<br>"access_token": "eyJhbGciOiJSUzI...",<br>"expires_in": 86400,<br>"id_token": "eyJhbGciOiJSU...",<br>"refresh_token": "yXI1bFQKbXKLD7AIU...",<br>"scope": "openid profile email offline",<br>"token_type": "bearer"<br>} |
| createOrg            | Constructs redirect url and sends user to Kinde to sign up and create a new org for your business | {<br>org_name?: string<br>}         | kinde.createOrg(); or<br>kinde.createOrg({org_name: 'your organization name'}); // Allow org_name to be provided if you want a specific organization name when you create |                                                                                                                                                                                                                              |
| getClaim             | Gets a claim from an access or id token                                                           | claim: string;<br>tokenKey?: string | await kinde.getClaim('given_name', 'id_token');                                                                                                                           | "David"                                                                                                                                                                                                                      |
| getPermission        | Returns the state of a given permission                                                           | key: string                         | await kinde.getPermission('read:todos');                                                                                                                                  | {"orgCode":"org_1234","isGranted":true}                                                                                                                                                                                      |
| getPermissions       | Returns all permissions for the current user for the organization they are logged into            |                                     | await kinde.getPermissions();                                                                                                                                             | {"orgCode":"org_1234","permissions":["create:todos","update:todos","read:todos"]}                                                                                                                                            |
| getOrganization      | Get details for the organization your user is logged into                                         |                                     | await kinde.getOrganization();                                                                                                                                            | {"orgCode": "org_1234"}                                                                                                                                                                                                      |
| getUserDetails       | Returns the profile for the current user                                                          |                                     | await kinde.getUserDetails();                                                                                                                                             | {"given_name":"Dave","id":"abcdef","family_name":"Smith","email":"dave@smith.com"}                                                                                                                                           |
| getUserOrganizations | Gets an array of all organizations the user has access to                                         |                                     | await kinde.getUserOrganizations();                                                                                                                                       | {"orgCodes":["org1​234","org5​678"]}                                                                                                                                                                                         |
| isAuthenticated      | Return the boolean to demonstrate whether the user is authenticated or not.                       |                                     | await kinde.isAuthenticate                                                                                                                                                | true or false                                                                                                                                                                                                                |

## General tips

Sometimes there will be issues related to caching when you develop React Native.
There are some recommendations for cleaning the cache:

1. Remove `node_modules`, `yarn.lock` or `package-lock.json`
2. Clean cache: `yarn cache clean` or `npm cache clean --force`
3. Make sure you have changed values in `.env` file
4. Trying to install packages again: `yarn install` or `npm install`
5. Run Metro Bundler: `yarn start --reset-cache` or `npm start --reset-cache`

Assume your project path is `<StarterKit_PATH>`.

##### With Android:

1. Clean cache:

```bash
cd <StarterKit_PATH>/android./gradlew clean
```

2. Follow the steps in the above `General tips`.

##### With iOS:

1. Follow the steps at the above `General tips`.
2. Clean cache:

```bash
cd <StarterKit_PATH>/rm -rf Pods && rm -rd Podfile.lock
```

3. Clean build folders on Xcode.

If you need any assistance with getting Kinde connected reach out to us at support@kinde.com.

## How to run test

The simplest way to run the JavaScript test suite is by using the following command at the root of your React Native checkout:

```bash
npm test
```

## Documentation for API Endpoints

All URIs are relative to *https://your_kinde_domain.kinde.com/api/v1*

| Class                                  | Method                                                    | HTTP request                    | Description                                                 |
| -------------------------------------- | --------------------------------------------------------- | ------------------------------- | ----------------------------------------------------------- |
| _@kinde-oss/react-native-sdk.OAuthApi_ | [**getUser**](docs/OAuthApi.md#getUser)                   | **GET** /oauth2/user_profile    | Returns the details of the currently logged in user         |
| _@kinde-oss/react-native-sdk.OAuthApi_ | [**getUserProfileV2**](docs/OAuthApi.md#getUserProfileV2) | **GET** /oauth2/v2/user_profile | Returns the details of the currently logged in user         |
| _@kinde-oss/react-native-sdk.UsersApi_ | [**createUser**](docs/UsersApi.md#createUser)             | **POST** /user                  | Creates a user record                                       |
| _@kinde-oss/react-native-sdk.UsersApi_ | [**getUsers**](docs/UsersApi.md#getUsers)                 | **GET** /users                  | Returns a paginated list of end-user records for a business |

## Documentation for Models

-   [@kinde-oss/react-native-sdk.CreateUser200Response](docs/CreateUser200Response.md)
-   [@kinde-oss/react-native-sdk.CreateUserRequest](docs/CreateUserRequest.md)
-   [@kinde-oss/react-native-sdk.CreateUserRequestIdentitiesInner](docs/CreateUserRequestIdentitiesInner.md)
-   [@kinde-oss/react-native-sdk.CreateUserRequestIdentitiesInnerDetails](docs/CreateUserRequestIdentitiesInnerDetails.md)
-   [@kinde-oss/react-native-sdk.CreateUserRequestProfile](docs/CreateUserRequestProfile.md)
-   [@kinde-oss/react-native-sdk.GetUsers200Response](docs/GetUsers200Response.md)
-   [@kinde-oss/react-native-sdk.User](docs/User.md)
-   [@kinde-oss/react-native-sdk.UserIdentity](docs/UserIdentity.md)
-   [@kinde-oss/react-native-sdk.UserIdentityResult](docs/UserIdentityResult.md)
-   [@kinde-oss/react-native-sdk.UserProfile](docs/UserProfile.md)
-   [@kinde-oss/react-native-sdk.UserProfileV2](docs/UserProfileV2.md)

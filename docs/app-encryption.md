# App Encryption Compliance

## App Description

Care is a personal health management app that helps users track daily medications, schedule reminders, and log medication adherence. It communicates with a backend API to sync medication data, manage user accounts, and deliver notifications. All user data is transmitted securely over HTTPS and stored on the device using OS-provided secure storage.

## Encryption Declaration

The Care iOS app declares `ITSAppUsesNonExemptEncryption: false` in its Info.plist (configured via `mobile/app.json` under `expo.ios.infoPlist`). This means the app is **exempt** from encryption export regulations and does not require uploading compliance documentation (French declaration or US CCATS) to App Store Connect.

## Encryption Usage Summary

The app uses the following encryption, all provided by the operating system:

- **HTTPS/TLS** — All API calls to `https://care-api-k1b8.onrender.com` use HTTPS, handled by iOS's built-in `URLSession`/`NSURLSession`.
- **iOS Keychain** — JWT tokens are stored securely via `expo-secure-store`, which uses the iOS Keychain under the hood.
- **JWT Authentication** — Bearer tokens are generated server-side and sent over HTTPS. The app does not perform any token signing or cryptographic operations itself.

## Why the App Is Exempt

Apple exempts apps whose only encryption use is calling operating system-provided APIs (like `URLSession` for HTTPS and Keychain for secure storage). The Care app:

- Does **not** include any proprietary or third-party encryption libraries
- Does **not** implement custom encryption algorithms
- Does **not** use encryption for purposes beyond standard HTTPS communication and OS-level secure storage

This qualifies the app for the exemption described in Apple's documentation.

## Apple References

- [Complying with Encryption Export Regulations](https://developer.apple.com/documentation/security/complying-with-encryption-export-regulations)
- [Export Compliance Documentation](https://developer.apple.com/help/app-store-connect/reference/app-information/export-compliance-documentation-for-encryption/)

## Configuration Location

The `ITSAppUsesNonExemptEncryption` key is set in:

```
mobile/app.json -> expo.ios.infoPlist.ITSAppUsesNonExemptEncryption: false
```

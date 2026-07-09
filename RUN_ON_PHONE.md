# Run The App On Your Phone

Your computer Wi-Fi IP is currently:

```text
192.168.100.50
```

If your Wi-Fi changes, run `ipconfig` again and look for the IPv4 Address under `Wireless LAN adapter Wi-Fi`.

## 1. Start XAMPP

1. Open XAMPP Control Panel.
2. Start `Apache`.
3. Start `MySQL`.

## 2. Start The Backend

Open a new terminal in VS Code:

```powershell
cd "C:\3rd YEAR SEMESTER 2\FINAL YEAR PROJECT 2\BACKEND"
npm.cmd start
```

Leave this terminal open.

Test in your computer browser:

```text
http://localhost:5000/health
```

You should see:

```json
{"status":"ok","message":"Server is running"}
```

## 3. Start The Mobile App

Open a second terminal in VS Code:

```powershell
cd "C:\3rd YEAR SEMESTER 2\FINAL YEAR PROJECT 2\FRONTEND"
npm.cmd start -- --lan
```

Leave this terminal open too.

## 4. Open On Your Phone

1. Install `Expo Go` on your Android phone.
2. Connect your phone and computer to the same Wi-Fi.
3. Scan the QR code shown in the frontend terminal.
4. If scanning does not work, open Expo Go and enter:

```text
exp://192.168.100.50:19000
```

## 5. Test Product Verification

In the app, press `Check Connection`.

Then verify this sample code:

```text
TB-2024-001
```

Other sample codes:

```text
EA-2024-002
SG-2024-003
```

## Common Problems

If the phone cannot connect:

1. Make sure XAMPP MySQL is running.
2. Make sure backend terminal is still open.
3. Make sure frontend terminal is still open.
4. Make sure phone and computer are on the same Wi-Fi.
5. Allow Node.js through Windows Firewall if Windows asks.
6. If your computer IP changed, update these files:
   - `BACKEND\.env`
   - `FRONTEND\.env`
   - `FRONTEND\App.js`, line with `FALLBACK_API_HOST`

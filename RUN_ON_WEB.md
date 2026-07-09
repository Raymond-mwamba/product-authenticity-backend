# Run The App In A Web Browser

## 1. Start XAMPP

Open XAMPP Control Panel and start:

```text
Apache
MySQL
```

## 2. Start The Backend

Open a VS Code terminal:

```powershell
cd "C:\3rd YEAR SEMESTER 2\FINAL YEAR PROJECT 2\BACKEND"
npm.cmd start
```

Leave this terminal open.

Check the backend in your browser:

```text
http://localhost:5000/health
```

You should see `status: ok`.

## 3. Start The Web App

Open a second VS Code terminal:

```powershell
cd "C:\3rd YEAR SEMESTER 2\FINAL YEAR PROJECT 2\FRONTEND"
npm.cmd run web
```

Expo will start the web version. If the browser does not open automatically, open:

```text
http://localhost:19006
```

## 4. Test It

Press `Check Connection`, then verify:

```text
TB-2024-001
```

## If You Already Started Expo For Phone

If your frontend terminal is already running `npm.cmd start -- --lan`, just click that terminal and press:

```text
w
```

That opens the same app in the browser.

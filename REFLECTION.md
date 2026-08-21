# Security Reflections

## 1. XSS with an HttpOnly Cookie
An attacker can run JavaScript in the patient's browser and use the patient's logged-in session to read data or take actions the patient is allowed to take. They cannot read the JWT with `document.cookie` or steal the HttpOnly cookie directly. HttpOnly makes token theft harder, but it does not make XSS safe because the attacker can still act as the patient.

## 2. Returning 404 Instead of 403
A `404 Not Found` response makes patient A's request look like a request for an appointment that does not exist. A `403 Forbidden` tells patient A that the appointment exists but is protected, which leaks information. Returning 404 hides whether patient B's appointment exists while still blocking access.

## 3. Why `/me` Exists
The browser sends the cookie automatically, but the cookie only proves that the user is logged in. `/me` lets the server check the token and send the app the current user's name, ID, and role after a page refresh. It also detects accounts that were deleted or changed without putting the JWT where JavaScript can read it.

## 4. Hiding the Confirm Button Is Not Security
A patient can inspect the page or send the request directly even when the button is hidden. The server must check the user's login, staff role, allowed status, and permission to change the appointment. Hiding the button helps the user interface, but it does not protect the action.

## 5. Signing Out Every Device with a JWT
A JWT usually stays valid until it expires, and logging out on one browser only clears that browser's cookie. To log out every device right away, the server must keep extra information, such as a user token version, a blocked-token list, or short-lived access tokens with refresh tokens. This lets the server reject old tokens, but it makes the system less simple than basic stateless JWT login.

## 6. Choosing a JWT Lifetime
A shorter lifetime gives an attacker less time to use a stolen token and is safer on an unattended clinic computer, but users may need to log in more often. A seven-day lifetime is easier for users, but a stolen token could be used for a full week. For a clinic, I would use a 15-minute access token with refresh tokens that can be revoked and a way to log out all devices.

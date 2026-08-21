<div align="center">

# Security Reflections

</div>

---

## 1. XSS with an HttpOnly Cookie

An attacker can run JavaScript in the patient's browser and use the patient's logged-in session to read data or take actions the patient is allowed to take. They cannot read the JWT with `document.cookie` or steal the HttpOnly cookie directly. HttpOnly makes token theft harder,so that they can't use this token somewhere else, but it does not make XSS safe because the attacker can still act as the patient.

---

## 2. Returning 404 Instead of 403

A `404 Not Found` response makes patient A's request look like a request for an appointment that does not exist. A `403 Forbidden` tells patient A that the appointment exists but is protected, which leaks information. Returning 404 hides whether patient B's appointment exists while still blocking access. It means it does not tell the patient A about patient B by 404, as 403 tells them that the data of pateint B exists.

---

## 3. Why `/me` Exists

The browser sends the cookie automatically, but the cookie only proves that the user is logged in. `/me` lets the server check the token and send the app the current user's name, ID, and role after a page refresh. It also detects accounts that were deleted or changed without putting the JWT where JavaScript can read it. It means that the `/me` lets the browser to get the token back and show the same user, not asking again for the login.

---

## 4. Hiding the Confirm Button Is Not Security

A patient can inspect the page or send the request directly even when the button is hidden. The server must check the user's login, staff role, allowed status, and permission to change the appointment. Hiding the button helps the user interface, but it does not protect the action. As someone can open DevTools or use the Postman to send the same request from the same URL, from where the button sent the same request, easily bypassing the frontend.

---

## 5. Signing Out Every Device with a JWT

A JWT usually stays valid until it expires, and logging out on one browser only clears that browser's cookie. To log out every device right away, the server must keep extra information, such as a user token version, a blocked-token list, or short-lived access tokens with refresh tokens. This lets the server reject old tokens, but it makes the system less simple than basic stateless JWT login. It means that JWT token is onyl for a device and for a limited time, when user logs out of the system, it only deletes the token from that browser/system, removing account from every place requires a lot of code and complexity.

---

## 6. Choosing a JWT Lifetime

A shorter lifetime gives an attacker less time to use a stolen token and is safer on an unattended clinic computer, but users may need to log in more often. A seven-day lifetime is easier for users, but a stolen token could be used for a full week. For a clinic, I would use a 15-minutes or 1-day access token with refresh tokens that can be revoked and a way to log out all devices. Means for the pateints, 7-day token is better as someone maybe not a tech guy, and for the clinic staff, I would prefer to use 1-hour or 1-day token, as unauthorized access can't get much of it.

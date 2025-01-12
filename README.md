# App

GymPass style app.

## FRs (Functional requirements)

- [x] It should be able to sign up;
- [x] It should be able to authenticate;
- [x] It should be able to get the authenticated user profile;
- [x] It should be able to get the amount of check-ins made by the authenticated user;
- [x] It should be able to obtain the user's check-in history;
- [x] It should be able to search for nearby gyms (up to 10km);
- [x] It should be able to search gyms by name;
- [x] It should be able make a check-in at a gym;
- [x] It should be able to validate the user check-in;
- [x] It should be able to register a gym;

## BRs (Business requirements)

- [x] The user must not sign up with a duplicate email;
- [x] The user must not make 2 check-ins on the same day;
- [x] The user must not make a check-in if they aren't near (100m) of the gym;
- [x] The check must only be validated until 20 minutes after created;
- [x] The check-in must only be validated by administrators;
- [x] The gym must only be registered by administrators;

## NFRs (Non-functional requirements)

- [x] The user's password should be encrypted;
- [x] The application's data should be persisted in a PostgresSQL database;
- [x] All data lists should be paginated with 20 items per page;
- [x] The user should be identified by a JWT (JSON Web Token);

# App

GymPass style app.

## FRs (Functional requirements)

- [ ] It should be able to sign up;
- [ ] It should be able to authenticate;
- [ ] It should be able to get the authenticated user profile;
- [ ] It should be able to get the amount of check-ins made by the authenticated user;
- [ ] It should be able to obtain the user's check-in history;
- [ ] It should be able to search for nearby gyms;
- [ ] It should be able to search gyms by name;
- [ ] It should be able make a check-in at a gym;
- [ ] It should be able to validate the user check-in;
- [ ] It should be able to register a gym;

## BRs (Business requirements)

- [ ] The user must not sign up with a duplicate email;
- [ ] The user must not make 2 check-ins on the same day;
- [ ] The user must not make a check-in if they aren't near (100m) of the gym;
- [ ] The check must only be validated until 20 minutes after created;
- [ ] The check-in must only be validated by administrators;
- [ ] The gym must only be registered by administrators;

## NFRs (Non-functional requirements)

- [ ] The user's password should be encrypted;
- [ ] The application's data should be persisted in a PostgresSQL database;
- [ ] All data lists should be paginated with 20 items per page;
- [ ] The user should be identified by a JWT (JSON Web Token);

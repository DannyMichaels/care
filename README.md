# Care
- [Overview](#Overview)
- [MVP](#MVP)
  - [Goals](#Goals)
  - [Libraries and Dependencies](#libraries-and-dependencies)
  - [Client (Front End)](#client-front-end)
    - [Wireframes](#wireframes)
    - [Component Tree](#component-tree)
    - [Component Hierarchy](#component-hierarchy)
    - [Component Breakdown](#component-breakdown)
    - [Time Estimates](#time-estimates)
  - [Server (Back End)](#server-back-end)
    - [ERD Model](#erd-model)
- [Post-MVP](#post-mvp)
- [Code Showcase](#code-showcase)
- [Code Issues & Resolutions](#code-issues--resolutions)

<br>

<br>

## Overview

**Care** is a therapy/self-care app where a user will be able to track his mood, create affirmations, and read/share educational insights with the community.
A post mvp feature will allow the user to track his symptoms.


<br>

## MVP

- *Care* will feature full-crud (create-read-update-destroy) functionality for: moods and posts, which will be managed by a user.
- *Care* will be user-friendly.
- *Care* will feature mobile-first design, that follows some of the [material-design](https://en.wikipedia.org/wiki/Material_Design) principles.
<br>

### Goals

- _Allow for user sign up, authentication, login, and verification._
- _Restrict the app only for logged in users (unlogged in users will be redirected to register/login)._
- _Posts page: user will be able to delete+edit his own posts, but not other users posts._
- _Mobile friendly design_ 

<br>

### Libraries and Dependencies



|     Library      | Description                                |
| :--------------: | :----------------------------------------- |
|      React       | _Front-end client server_ |
|   React Router   | _Front-end navigation between pages_ |
|  Axios           | _NPM Package to help make API requests_ |
| Styled-Components| _Front-end styling package_ |
| Material-UI      | _Front-end styling package_ |
|  Ruby on Rails   | _Back-end server_ |



<br>

### Client (Front End)

### Wireframes
> for the rest of the wireframes please visit this [link:](https://www.figma.com/file/w81a4kRRTnBui5JkqWn5ZN/Care-Wireframes)

### Mobile Login
![mobile landing](https://i.imgur.com/plRRI3d.png)
 <br>
### Mobile Home
![mobile home](https://i.imgur.com/C5il2wu.png)
<br>
### Mobile Community
![mobile community](https://i.imgur.com/BRyPhsQ.png)
<br>
### Mobile More 
![mobile more](https://i.imgur.com/Faj6lY9.png)
<br>

### Component Tree

> [Component Tree Link (Whimsical)](https://whimsical.com/care-JWXTaZdt8XN5jBPYfiuagm)

![component tree](https://i.imgur.com/F8QEXcy.png)

<br>

#### Component Hierarchy

``` structure

src
|__ assets/
      |__ fonts
      |__ graphics
      |__ images
      |__ mockups
|__ CurrentUser/
  |__ CurrentUserContext.jsx
|__ components/
   |__MoodComponents
      |__ Moods.jsx
      |__ MoodCard.jsx
   |__ AffirmationComponents/
       |__ Affirmations.jsx
   |__ InsightComponents/
       |__ Insights.jsx
       |__ InsightCard.jsx
|__ layouts/
  |__Layout/
     |__ Layout.jsx
     |__ Header.jsx
     |__ Footer.jsx
|__ services/
   |__ apiConfig.js
   |__ moods.js
   |__ auth.js
   |__ affirmations.js
   |__ insights.js
|_ containers/
   |__ MoodsContainer.jsx
   |__ AffirmationsContainer.jsx
   |__ InsightsContainer.jsx
|_ screens/
 |__Main/ 
   |__ Home.jsx
   |__ Community.jsx
   |__ More.jsx
   |__ Login.jsx
   |__ Register.jsx
 |__ AffirmationScreens/
   |__ AffirmationDetail.jsx
   |__ AffirmationEdit.jsx
   |__ AffirmationCreate.jsx
|__ MoodScreens/
   |__ MoodEdit.jsx
   |__ MoodCreate.jsx
|__ InsightScreens/
   |__ InsightEdit.jsx
   |__ InsightCreate.jsx
   |__ InsightDetail.jsx
```

#### Component Breakdown



|  Component   |    Type    | state | props | Description                                                      |
| :----------: | :--------: | :---: | :---: | :--------------------------------------------------------------- |
|    Header    | functional |   y   |   y  | _The header will contain the page name, current time and current user name and logout_|
| Mood Card    | functional |   y   |   y   | _The card will render the Mood info via props._                |
| Affirmations Card   | functional |   y   |   y   | _The cards will render the affirmation info via props._  |
| Insights Card  | functional |   y   |   y  | _The cards will render the insight post info via props._                |
|  CurrentUserContext   |    functional  |   y   |   n    |_CurrentUserContext.jsx will contain the provider and context for current user to be used globally throughtout the app_  |
|    Home      | functional |  n   |   n   |  _The Home screen will include all the logged moods and affirmations_ |
|    Community      | functional |  n   |   n   |   _The Community screen will include all posts made by users and the option to edit or delete a post_  |
|    More      | functional |  y    |   y  | _The More page will comtain current user info such as name email and password (will be editable as postmvp feature, and will have a dark mode switcher_ |
|    Footer    | functional |   y   |   n  | _The footer will contain the links to the pages_ |

#### Time Estimates

| Task                | Priority | Estimated Time | Time Invested | Actual Time |
| ------------------- | :------: | :------------: | :-----------: | :---------: |
| Create CRUD Actions BE |    H     |     3 hrs      |    TBD        |     TBD     |
| Create Layout       |    M     |     3 hrs      |    TBD        |     TBD     |
| Create User FE-CRUD      |    H     |     3 hrs      |    TBD        |     TBD     |
| Create Insight FE-CRUD        |    H     |     3 hrs      |    TBD        |     TBD     |
| Create Mood  FE-CRUD    |    H     |     3 hrs      |    TBD        |     TBD     |
| Create Home Page    |    H     |     2 hrs      |    TBD        |     TBD     |
| Create Community Page |  H     |     2 hr       |    TBD        |     TBD     |
| Create Account Page |    L     |   1 hr         |    TBD        |     TBD     |
| Create Dark Mode    |    L     |   1 hr         |   TBD         |    TBD      |
| TOTAL               |          |     50 hrs     |     TBD       |     TBD     |

> _Why is this necessary? Time frames are key to the development cycle. You have limited time to code your app, and your estimates can then be used to evaluate possibilities of your MVP and post-MVP based on time needed. It's best you assume an additional hour for each component, as well as a few hours added to the total time, to play it safe._

<br>

### Server (Back End)

#### ERD Model

[ERD Model Link](https://drive.google.com/file/d/16G7t1UU_fHARCdY8dVpV2eJWvtP0pbsW/view?usp=sharing)

![ERD Model](https://i.imgur.com/oSjIIuY.png)
<br>

***

## Post-MVP
- dark mode, the user will be able to switch between light mode and dark mode.
- affirmations, the user will be abel to add,edit and delete affirmations.
- symptoms, the user will be able to add, edit and delete symtpoms.
- password confirm on register: you will need to confirm your password to create your account.

***

## Code Showcase

> Use this section to include a brief code snippet of functionality that you are proud of and a brief description.

## Code Issues & Resolutions

> Use this section to list of all major issues encountered and their resolution.

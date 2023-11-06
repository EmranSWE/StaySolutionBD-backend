# Stay Solution BD , is one point solution of rental service

### Live Link: https://stay-solution-bd-backend.vercel.app/api/v1
 - POSTMAN https://martian-comet-596528.postman.co/workspace/New-Team-Workspace~4291e7f1-879e-4461-9d74-21bf9d590423/collection/27394351-094df829-23b0-4ef2-a540-4f7464feb98b?action=share&creator=27394351

# StaySolutionBD Backend

Welcome to the backend repository for StaySolutionBD, a premier solution rental services platform that connects property owners with potential renters. Our backend is built to handle everything from user registration to property listings, bookings, payments, and more, providing a seamless experience for both tenants and property owners.

## Table of Contents

- [Introduction](#introduction)
- [Software Requirements](#software-requirements)
- [Installation](#installation)
- [Usage](#usage)
- [Core Features](#core-features)
- [Additional Features](#additional-features)
- [API Endpoints](#api-endpoints)
- [Development and Testing](#development-and-testing)
- [Launch and Post-Launch](#launch-and-post-launch)
- [Entity Relationship Diagram](#entity-relationship-diagram)
- [Model Design](#model-design)
- [JSON Data Examples](#json-data-examples)
- [Contributing](#contributing)
- [Credits](#credits)
- [License](#license)
## Introduction

StaySolutionBD is designed to ease the rental process for both property owners and tenants. This backend repository contains all necessary code to set up the server, database, and APIs required for the frontend application to function properly.

## Core Features

- **User Registration and Profiles**
  - Separate registration processes for property owners and renters.
  - Profiles store and display relevant details like owner’s properties and tenant’s booking history.

- **Property Listing**
  - Owners can add, edit, and delete their property listings.
  - Listings contain details like images, pricing, amenities, rules, location (with map integration), available dates, and more.

- **Search and Filter**
  - Tenants can search for properties based on criteria like location, price range, amenities, and more.
  - Detailed property view with all information and owner contact details.

- **Booking System**
  - Tenants can book available properties for specific dates.
  - Integration with a calendar to show availability and a confirmation process.

- **Payment Integration**
  - Tenants can pay rent online using various methods like credit cards, bank transfers, and digital wallets.

- **Repair/Issue Reporting**
  - Tenants can report issues they encounter during their stay.
  - Integration with a ticketing system for owners to track and address these issues.

- **Messaging System**
  - Direct, secure messaging between owners and tenants with end-to-end encryption.

- **Ratings and Reviews**
  - Tenants can rate and review properties after their stay, and owners can respond to these reviews.

## Tech Stack

- **Front-end**: Next.js
- **Back-end**: Node.js
- **Database**: PostgreSQL

## Database Entities and Relationships

### Entities

### User
- **UserID**: Primary Key 
- **FirstName**: User's first name
- **LastName**: User's last name
- **Email**: User's email address
- **Password**: Encrypted password for authentication
- **Phone**: User's phone number
- **ProfilePic**: URL to the profile picture
- **UserType**: Specifies if user is a renter or property owner
- **PreferredPropertyType**: User's preference for property types (e.g., Apartment, House, etc.)
- **PreferredAmenities**: Amenities the user looks for in a property
- **PreferredLocation**: User's preferred property location
- **SearchHistory**: Record of the user's search activities
- **BookingHistory**: Record of the user's booking activities
- **SocialMediaLinks**: URLs to user's social media profiles
- **UserStatus**: Active, Inactive, etc.

### Property
- **PropertyID**: Primary Key 
- **OwnerID**: Foreign Key referencing User
- **Address**: Location of the property
- **Description**: A brief about the property
... *(Continue with the other fields you've provided for Property)*

### Booking
- **BookingID**: Primary Key 
- **TenantID**: Foreign Key referencing User
- **PropertyID**: Foreign Key referencing Property

### Payment
- **PaymentID**: Primary Key
- **BookingID**: Foreign Key referencing Booking
- **Amount**: Amount of the payment
- **PaymentMethod**: Method used for the payment (e.g., credit card, bank transfer)
- **PaymentStatus**: Current status of the payment (e.g., pending, completed)
- **PaymentDate**: Date when the payment was made or processed
- **SecurityDepositAmount**: Amount kept as security deposit

### Review
- **ReviewID**: Primary Key
- **PropertyID**: Foreign Key referencing Property
- **TenantID**: Foreign Key referencing User
- **Rating**: Rating given to the property
- **Comments**: Review comments or feedback
- **ReviewDate**: Date of the review
- **ResponseFromOwner**: Owner's response to the review, if any
- **ReviewPhotos**: Any photos added with the review

### Issue (Refair)
- **IssueID**: Primary Key
- **PropertyID**: Foreign Key referencing Property
- **TenantID**: Foreign Key referencing User
- **IssueDescription**: Description of the issue or repair needed
- **IssueStatus**: Current status of the issue (e.g., pending, resolved)
- **ReportDate**: Date when the issue was reported
- **PriorityLevel**: Priority assigned to the issue (e.g., high, medium, low)

### Message
- **MessageID**: Primary Key
- **SenderID**: Foreign Key referencing User
- **ReceiverID**: Foreign Key referencing User
- **Content**: Message content
- **Timestamp**: When the message was sent
- **MessageCategory**: Category or type of the message (e.g., inquiry, complaint)

### Notification
- **NotificationID**: Primary Key
- **UserID**: Foreign Key referencing User
- **Content**: Notification content
- **Timestamp**: When the notification was issued
- **NotificationType**: Type of notification (e.g., alert, reminder)
- **NotificationPlatform**: Where the notification was sent (e.g., app, email)
  

### Relationships

#### User to Property
- **Owns**: A user can own multiple properties, but each property is owned by a single user.
- **Cardinality**: One to Many (from User to Property)

#### User to Booking
- **Books**: A user (as a tenant) can book multiple properties, but each booking is associated with one user.
- **Cardinality**: One to Many (from User to Booking)

#### Property to Booking
- **Is Booked As**: A property can have multiple bookings over time, but each booking is associated with a single property.
- **Cardinality**: One to Many (from Property to Booking)

#### Booking to Payment
- **Generates**: Each booking can generate multiple payments, especially if there's a system of installments or split payments.
- **Cardinality**: One to Many (from Booking to Payment)

#### Property to Review
- **Receives**: A property can receive multiple reviews, but each review is specific to a single property.
- **Cardinality**: One to Many (from Property to Review)

#### User to Review
- **Writes**: A user can write multiple reviews, but each review is written by a single user.
- **Cardinality**: One to Many (from User to Review)

#### Property to Issue (Repair)
- **Has**: A property can have multiple issues reported, but each issue is associated with a single property.
- **Cardinality**: One to Many (from Property to Issue)

#### User to Issue (Repair)
- **Reports**: A user can report multiple issues across different properties, but each issue report is made by a single user.
- **Cardinality**: One to Many (from User to Issue)

#### User to Message (as a Sender)
- **Sends**: A user can send messages to multiple users.
- **Cardinality**: One to Many (from one User to many Messages)

#### User to Message (as a Receiver)
- **Receives**: A user can receive messages from multiple users.
- **Cardinality**: One to Many (from one User to many Messages)

#### User to Notification
- **Receives Notification**: A user can receive multiple notifications.
- **Cardinality**: One to Many (from User to Notification)

#### User to Wishlist
- **Creates Wishlist**: A user can have multiple items in their wishlist.
- **Cardinality**: One to Many (from User to Wishlist)

#### Property to Wishlist
- **Is Wished For**: A property can be on the wishlist of multiple users.
- **Cardinality**: One to Many (from Property to Wishlist)

#### User to Loyalty Program
- **Participates In**: A user can participate in the loyalty program.
- **Cardinality**: One to One (assuming each user has one loyalty program record)

#### Property to Safety
- **Has Safety Features**: Each property can have a record of its safety features.
- **Cardinality**: One to One (each property to its safety record)

#### User to Marketplace Items
- **Lists Item**: A user can list multiple items in the marketplace.
- **Cardinality**: One to Many (from User to Marketplace Items)

#### Property to Insurance
- **Is Insured By**: Each property can have an associated insurance policy.
- **Cardinality**: One to One (each property to its insurance record)

#### User to Insurance (as a Tenant)
- **Purchases Insurance**: A tenant can purchase multiple insurance policies (especially if they book multiple properties).
- **Cardinality**: One to Many (from User to Insurance policies)


## API Endpoints

#### User Endpoints
## API Endpoints

### Base URL
All endpoints are based on the following URL: `https://stay-solution-bd-backend.vercel.app/`

### User Endpoints
- **Register a User**
  - **Method**: `POST`
  - **Endpoint**: `/api/v1/user/users`
- **Login**
  - **Method**: `POST`
  - **Endpoint**: `/api/v1/user/login`
- **Get User Details**
  - **Method**: `GET`
  - **Endpoint**: `/api/v1/user/users/{id}`
- **Update User**
  - **Method**: `PUT`
  - **Endpoint**: `/api/v1/user/users/{id}`
- **Delete User**
  - **Method**: `DELETE`
  - **Endpoint**: `/api/v1/user/users/{id}`

### Property Endpoints
- **Add Property**
  - **Method**: `POST`
  - **Endpoint**: `/api/v1/property/properties`
- **Get All Properties**
  - **Method**: `GET`
  - **Endpoint**: `/api/v1/property/properties`
  - ### Review Endpoints
- **Add a Review for a Property**
  - **Method**: `POST`
  - **Endpoint**: `/api/v1/review/reviews`
- **Get Reviews for a Property**
  - **Method**: `GET`
  - **Endpoint**: `/api/v1/property/properties/{id}/reviews`

### Issue (Repair) Endpoints
- **Report an Issue for a Property**
  - **Method**: `POST`
  - **Endpoint**: `/api/v1/issue/issues`
- **Get Issue Details**
  - **Method**: `GET`
  - **Endpoint**: `/api/v1/issue/issues/{id}`
- **Update an Issue**
  - **Method**: `PUT`
  - **Endpoint**: `/api/v1/issue/issues/{id}`

### Message Endpoints
- **Send a Message**
  - **Method**: `POST`
  - **Endpoint**: `/api/v1/message/messages`
- **Get Messages for a User**
  - **Method**: `GET`
  - **Endpoint**: `/api/v1/user/users/{id}/messages`

### Notification Endpoints
- **Create a Notification**
  - **Method**: `POST`
  - **Endpoint**: `/api/v1/notification/notifications`
- **Get Notifications for a User**
  - **Method**: `GET`
  - **Endpoint**: `/api/v1/user/users/{id}/notifications`
- **Delete a Notification**
  - **Method**: `DELETE`
  - **Endpoint**: `/api/v1/notification/notifications/{id}`

### Wishlist Endpoints
- **Add Property to Wishlist**
  - **Method**: `POST`
  - **Endpoint**: `/api/v1/wishlist/items`
- **View User Wishlist**
  - **Method**: `GET`
  - **Endpoint**: `/api/v1/user/users/{id}/wishlist`
- **Remove Property from Wishlist**
  - **Method**: `DELETE`
  - **Endpoint**: `/api/v1/wishlist/items/{id}`

### Loyalty Program Endpoints
- **Join Loyalty Program**
  - **Method**: `POST`
  - **Endpoint**: `/api/v1/loyalty/enroll`
- **Get User Loyalty Points**
  - **Method**: `GET`
  - **Endpoint**: `/api/v1/user/users/{id}/loyalty`
- **Redeem Loyalty Points**
  - **Method**: `POST`
  - **Endpoint**: `/api/v1/loyalty/redeem`

### Local Services & Attractions Endpoints
- **List a Local Service/Attraction**
  - **Method**: `POST`
  - **Endpoint**: `/api/v1/services/list`
- **Get Services & Attractions by Location**
  - **Method**: `GET`
  - **Endpoint**: `/api/v1/services?location={location}`

### Safety Endpoints
- **Add Safety Record for Property**
  - **Method**: `POST`
  - **Endpoint**: `/api/v1/safety/records`
- **Fetch Safety Records for Property**
  - **Method**: `GET`
  - **Endpoint**: `/api/v1/property/properties/{id}/safety`

### Insurance Endpoints
- **Purchase Insurance for a Property Booking**
  - **Method**: `POST`
  - **Endpoint**: `/api/v1/insurance/purchase`
- **View Insurance Policies for a User**
  - **Method**: `GET`
  - **Endpoint**: `/api/v1/user/users/{id}/insurance`


## License

This project is licensed under the MIT License.


### All code are update as per requirement,

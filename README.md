# Stay Solution BD , is one point solution of rental service

### Live Link: https://stay-solution-bd-backend.vercel.app/api/v1

# Stay Solution BD

A comprehensive property management system that provides a seamless experience for property owners and renters.

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

#### User
- UserID (Primary Key)
- FirstName, LastName, Email, Password, ...
#### Property
- PropertyID (Primary Key)
- OwnerID (Foreign Key referencing User)
- Address, Description, ...
... *(Continue with all the entities you've provided)*

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

- **Registration**: 
  - [POST] `/api/v1/user/users`: Register a new user.
- **Login**: 
  - [POST] `/api/v1/user/login`: User login.
... *(Continue with all the endpoints you've provided)*

## Contributing

For contributions, please create a pull request. Make sure to follow the coding standards and add tests for new features.

## License

This project is licensed under the MIT License.



### All code are update as per requirement,

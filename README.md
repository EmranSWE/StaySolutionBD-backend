# Stay Solution BD , is one point solution of rental service

### Live Link: https://stay-solution-bd-backend.vercel.app/api/v1

## Core Feature

● User Registration and Profiles:
● Separate registration processes for property owners and renters.
● Profiles should store and display relevant details (e.g., owner’s properties,
tenant’s booking history).
● Property Listing:
● Owners can add/edit/delete their property listings.
● Key details: Images, pricing, amenities, rules, location (with map integration),
available dates, etc.
● Search and Filter:
● Tenants can search properties based on various criteria like location, price range,
amenities, and more.
● Detailed property view with all the info and owner contact details.
● Booking System:
● Tenants can book available properties for desired dates.
● Calendar integration to show availability.
● Booking confirmation process (either instant or after owner’s approval).
● Payment Integration:
● Tenants can pay their rent online.
● Support various payment methods (credit card, bank transfer, digital wallets).
● Automatic payment reminders.
● Refair/Issue Reporting:
● Tenants can report issues they face during their stay.
● Integration with ticketing system so owners can track and resolve the issue.
● Messaging System:
● Direct messaging between owners and tenants.
● Ensure security and privacy, consider end-to-end encryption.
● Ratings and Reviews:
● After the stay, tenants can rate and review properties.
● Owners can respond to reviews.
Choose the Tech Stack: Depending on your requirements, you might consider using
frameworks and technologies like Next.js for the front end and Node.js, for the backend.
● Database: PostgreSQL, could be used to store user profiles, property listings, and
booking details.

## Entity

Entities
User:
● UserID (Primary Key)
● FirstName, LastName, Email, Password, Phone, ProfilePic, UserType,
PreferredPropertyType, PreferredAmenities, PreferredLocation, SearchHistory,
BookingHistory, SocialMediaLinks, UserStatus
Property:
● PropertyID (Primary Key)
● OwnerID (Foreign Key referencing User)
● Address, Description, NumberOfRooms, Amenities, Rules, Pricing, ImageGallery,
AvailabilityCalendar, PropertyStatus, VideoLink, PropertyTags, FloorPlans
Booking:
● BookingID (Primary Key)
● TenantID (Foreign Key referencing User)
● PropertyID (Foreign Key referencing Property)
● StartDate, EndDate, BookingStatus, SpecialRequests
Payment:
● PaymentID (Primary Key)
● BookingID (Foreign Key referencing Booking)
● Amount, PaymentMethod, PaymentStatus, PaymentDate,
SecurityDepositAmount
Review:
● ReviewID (Primary Key)
● PropertyID (Foreign Key referencing Property)
● TenantID (Foreign Key referencing User)
● Rating, Comments, ReviewDate, ResponseFromOwner, ReviewPhotos
Issue (Refair):
● IssueID (Primary Key)
● PropertyID (Foreign Key referencing Property)
● TenantID (Foreign Key referencing User)
● IssueDescription, IssueStatus, ReportDate, PriorityLevel
Message:
● MessageID (Primary Key)
● SenderID (Foreign Key referencing User)
● ReceiverID (Foreign Key referencing User)
● Content, Timestamp, MessageCategory
Notification:
● NotificationID (Primary Key)
● UserID (Foreign Key referencing User)
● Content, Timestamp, NotificationType, NotificationPlatform
Wishlist:
● WishlistID (Primary Key)
● UserID (Foreign Key referencing User)
● PropertyID (Foreign Key referencing Property)
● DateAdded
Loyalty Program:
● LoyaltyID (Primary Key)
● UserID (Foreign Key referencing User)
● Points, RedemptionHistory
Local Services & Attractions:
● ServiceID (Primary Key)
● Location, ServiceType, Description, ContactDetails, OperatingHours
Safety:
● SafetyID (Primary Key)
● PropertyID (Foreign Key referencing Property)
● SafetyAmenities, SafetyScore
Marketplace:
● ItemID (Primary Key)
● OwnerID (Foreign Key referencing User)
● ItemDescription, Price, Category
Insurance:
● InsuranceID (Primary Key)
● PropertyID (Foreign Key referencing Property)
● TenantID (Foreign Key referencing User)
● PolicyDetails, CoverageAmount, ExpiryDate

## Relationship

User to Property:
● Relationship Name: "Owns"
● Description: A user can own multiple properties, but each property is owned by a
single user.
● Cardinality: One to Many (from User to Property)
User to Booking:
● Relationship Name: "Books"
● Description: A user (as a tenant) can book multiple properties, but each booking is
associated with one user.
● Cardinality: One to Many (from User to Booking)
Property to Booking:
● Relationship Name: "Is Booked As"
● Description: A property can have multiple bookings over time, but each booking is
associated with a single property.
● Cardinality: One to Many (from Property to Booking)
Booking to Payment:
● Relationship Name: "Generates"
● Description: Each booking can generate multiple payments, especially if there's a
system of installments or split payments.
● Cardinality: One to Many (from Booking to Payment)
Property to Review:
● Relationship Name: "Receives"
● Description: A property can receive multiple reviews, but each review is specific to a
single property.
● Cardinality: One to Many (from Property to Review)
User to Review:
● Relationship Name: "Writes"
● Description: A user can write multiple reviews, but each review is written by a single
user.
● Cardinality: One to Many (from User to Review)
Property to Issue (Repair):
● Relationship Name: "Has"
● Description: A property can have multiple issues reported, but each issue is
associated with a single property.
● Cardinality: One to Many (from Property to Issue)
User to Issue (Repair):
● Relationship Name: "Reports"
● Description: A user can report multiple issues across different properties, but each
issue report is made by a single user.
● Cardinality: One to Many (from User to Issue)
User to Message (as a Sender):
● Relationship Name: "Sends"
● Description: A user can send messages to multiple users.
● Cardinality: One to Many (from one User to many Messages)
User to Message (as a Receiver):
● Relationship Name: "Receives"
● Description: A user can receive messages from multiple users.
● Cardinality: One to Many (from one User to many Messages)
User to Notification:
● Relationship Name: "Receives Notification"
● Description: A user can receive multiple notifications.
● Cardinality: One to Many (from User to Notification)
User to Wishlist:
● Relationship Name: "Creates Wishlist"
● Description: A user can have multiple items in their wishlist.
● Cardinality: One to Many (from User to Wishlist)
Property to Wishlist:
● Relationship Name: "Is Wished For"
● Description: A property can be on the wishlist of multiple users.
● Cardinality: One to Many (from Property to Wishlist)
User to Loyalty Program:
● Relationship Name: "Participates In"
● Description: A user can participate in the loyalty program.
● Cardinality: One to One (assuming each user has one loyalty program record)
Property to Safety:
● Relationship Name: "Has Safety Features"
● Description: Each property can have a record of its safety features.
● Cardinality: One to One (each property to its safety record)
User to Marketplace Items:
● Relationship Name: "Lists Item"
● Description: A user can list multiple items in the marketplace.
● Cardinality: One to Many (from User to Marketplace Items)
Property to Insurance:
● Relationship Name: "Is Insured By"
● Description: Each property can have an associated insurance policy.
● Cardinality: One to One (each property to its insurance record)
User to Insurance (as a Tenant):
● Relationship Name: "Purchases Insurance"
● Description: A tenant can purchase multiple insurance policies (especially if they
book multiple properties).
● Cardinality: One to Many (from User to Insurance policies)

## Application Routes:

## Endpoints

## =========== POSTMAN =============

# here https://martian-comet-596528.postman.co/workspace/New-Team-Workspace~4291e7f1-879e-4461-9d74-21bf9d590423/collection/27394351-094df829-23b0-4ef2-a540-4f7464feb98b?action=share&creator=27394351

User Endpoints:
Registration:
● POST https://stay-solution-bd-backend.vercel.app/api/v1/user/users: Register a new user
Login:
● POST https://stay-solution-bd-backend.vercel.app/api/v1/user/login: User login
User Details:
● GET https://stay-solution-bd-backend.vercel.app/api/v1/user/users/{id}: Get user details by ID
Update User:
● PUT https://stay-solution-bd-backend.vercel.app/api/v1/user/users/{id}: Update user details
Delete User:
● DELETE https://stay-solution-bd-backend.vercel.app/api/v1/user/users/{id}: Delete a user
Property Endpoints:
Add Property:
● POST https://stay-solution-bd-backend.vercel.app/api/v1/property/properties: Add a new property
Get All Properties:
● GET https://stay-solution-bd-backend.vercel.app/api/v1/property/properties: Get all properties
Property Details:
● GET https://stay-solution-bd-backend.vercel.app/api/v1/property/properties/{id}: Get property details by ID
Update Property:
● PUT https://stay-solution-bd-backend.vercel.app/api/v1/property/properties/{id}: Update property details
Delete Property:
● DELETE https://stay-solution-bd-backend.vercel.app/api/v1/property/properties/{id}: Delete a property
Booking Endpoints:
Create a Booking:
● POST https://stay-solution-bd-backend.vercel.app/api/v1/booking/bookings: Create a new booking
Get Booking Details:
● GET https://stay-solution-bd-backend.vercel.app/api/v1/booking/bookings/{id}: Get booking details by ID
Get Bookings for a User:
● GET https://stay-solution-bd-backend.vercel.app/api/v1/user/users/{id}/bookings: Get bookings for a specific
user
Update Booking:
● PUT https://stay-solution-bd-backend.vercel.app/api/v1/booking/bookings/{id}: Update a booking
Cancel Booking:
● DELETE https://stay-solution-bd-backend.vercel.app/api/v1/booking/bookings/{id}: Cancel a booking
Payment Endpoints:
Make Payment:
● POST https://stay-solution-bd-backend.vercel.app/api/v1/payment/payments: Make a new payment
Get Payment Details:
● GET https://stay-solution-bd-backend.vercel.app/api/v1/payment/payments/{id}: Get payment details by ID
Payments for a Booking:
● GET https://stay-solution-bd-backend.vercel.app/api/v1/booking/bookings/{id}/payments: Get payments for a
specific booking
Review Endpoints:
Add a Review:
● POST https://stay-solution-bd-backend.vercel.app/api/v1/review/reviews: Add a review for a property
Get Reviews for a Property:
● GET https://stay-solution-bd-backend.vercel.app/api/v1/property/properties/{id}/reviews: Get all reviews for a
specific property
Issue (Repair) Endpoints:
Report an Issue:
● POST https://stay-solution-bd-backend.vercel.app/api/v1/issue/issues: Report an issue for a property
Get Issue Details:
● GET https://stay-solution-bd-backend.vercel.app/api/v1/issue/issues/{id}: Get issue details by ID
Update an Issue:
● PUT https://stay-solution-bd-backend.vercel.app/api/v1/issue/issues/{id}: Update an issue (e.g., status change)
Message Endpoints:
Send a Message:
● POST https://stay-solution-bd-backend.vercel.app/api/v1/message/messages: Send a message
Get Messages for a User:
● GET https://stay-solution-bd-backend.vercel.app/api/v1/user/users/{id}/messages: Get all messages for a
specific user
Notification Endpoints:
Create a Notification:
● POST https://stay-solution-bd-backend.vercel.app/api/v1/notification/notifications: Create a new notification for
a user
Get Notifications for a User:
● GET https://stay-solution-bd-backend.vercel.app/api/v1/user/users/{id}/notifications: Fetch all notifications for a
specific user
Delete a Notification:
● DELETE https://stay-solution-bd-backend.vercel.app/api/v1/notification/notifications/{id}: Remove a specific
notification
Wishlist Endpoints:
Add Property to Wishlist:
● POST https://stay-solution-bd-backend.vercel.app/api/v1/wishlist/items: Add a property to a user's wishlist
View User Wishlist:
● GET https://stay-solution-bd-backend.vercel.app/api/v1/user/users/{id}/wishlist: Get all properties in a user's
wishlist
Remove Property from Wishlist:
● DELETE https://stay-solution-bd-backend.vercel.app/api/v1/wishlist/items/{id}: Remove a specific property from
the wishlist
Loyalty Program Endpoints:
Join Loyalty Program:
● POST https://stay-solution-bd-backend.vercel.app/api/v1/loyalty/enroll: Enroll a user in the loyalty program
Get User Loyalty Points:
● GET https://stay-solution-bd-backend.vercel.app/api/v1/user/users/{id}/loyalty: Fetch loyalty points and
redemption history for a user
Redeem Loyalty Points:
● POST https://stay-solution-bd-backend.vercel.app/api/v1/loyalty/redeem: Redeem points for rewards or
discounts
Local Services & Attractions Endpoints:
List a Local Service/Attraction:
● POST https://stay-solution-bd-backend.vercel.app/api/v1/services/list: List a new local service or attraction
Get Services & Attractions by Location:
● GET https://stay-solution-bd-backend.vercel.app/api/v1/services?location={location}: Fetch services and
attractions based on a location
Safety Endpoints:
Add Safety Record for Property:
● POST https://stay-solution-bd-backend.vercel.app/api/v1/safety/records: Add a safety record for a specific
property
Fetch Safety Records for Property:
● GET https://stay-solution-bd-backend.vercel.app/api/v1/property/properties/{id}/safety: Get safety records for a
property
Marketplace Endpoints:
List an Item in Marketplace:
● POST https://stay-solution-bd-backend.vercel.app/api/v1/marketplace/list: List an item or service in the
marketplace
Browse Marketplace by Category:
● GET https://stay-solution-bd-backend.vercel.app/api/v1/marketplace?category={category}: View items in the
marketplace by category
Insurance Endpoints:
Purchase Insurance:
● POST https://stay-solution-bd-backend.vercel.app/api/v1/insurance/purchase: Buy insurance for a property
booking
View Insurance Policies for User:
● GET https://stay-solution-bd-backend.vercel.app/api/v1/user/users/{id}/insurance: View all insurance policies
bought by a user

### All code are update as per requirement,

![image}(https://github.com/Trevor-04/team-9-project-3380/blob/main/frontend/public/animal_banner.webp)
# Project Requirements

1. [User Authentication for Different User Roles](#user-authentication-for-different-user-roles)
2. [Data Entry Forms to Add New Data, Modify Existing Data, and 'Delete' Data](#data-entry-forms-to-add-new-data-modify-existing-data-and-delete-data)
3. [At Least 2 Triggers](#triggers)
4. [At Least 3 Queries](#queries)
5. [At Least 3 Reports](#reports)

## **Technologies**

- **Frontend**: ![React Badge](https://img.shields.io/badge/React-61DAFB?style=for-the-badge&logo=react&logoColor=black) ![Tailwind CSS Badge](https://img.shields.io/badge/Tailwind_CSS-06B6D4?style=for-the-badge&logo=tailwind-css&logoColor=white)
- **Backend**: ![Node.js Badge](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=node.js&logoColor=white)
- **Database**: ![MySQL Badge](https://img.shields.io/badge/MySQL-4479A1?style=for-the-badge&logo=mysql&logoColor=white)
- **Authentication**: ![JWT Badge](https://img.shields.io/badge/JWT-000000?style=for-the-badge&logo=json-web-tokens&logoColor=white)
- **Deployment**: ![Railway Badge](https://img.shields.io/badge/Railway-2A4D77?style=for-the-badge&logo=railway&logoColor=white) ![Netlify Badge](https://img.shields.io/badge/Netlify-00C7B7?style=for-the-badge&logo=netlify&logoColor=white)
- **Version Control**: ![GitHub Badge](https://img.shields.io/badge/GitHub-181717?style=for-the-badge&logo=github&logoColor=white) ![Git Badge](https://img.shields.io/badge/Git-F05032?style=for-the-badge&logo=git&logoColor=white)

You can also add links to relevant documentation for each technology:
- [React Documentation](https://reactjs.org/)
- [Node.js Documentation](https://nodejs.org/)
- [MySQL Documentation](https://dev.mysql.com/doc/)

## **User Authentication for Different User Roles**
We have 2 different user roles implemented. They are the employees and members.
- Employee: Employee can manage everything like events, animals, and merchandise along with seeing and generating reports about the zoo.
    - Username: alice.thompson@zoo.com
    - Password: 123456
- Member: Members can view events and animals for the zoo along with purchasing tickets.
    - Username: test1@example.com
    - Password: 123456
  
## **Data Entry Forms to Add New Data, Modify Existing Data, and 'Delete' Data**
### Members:
- [Sign Up](https://glowing-tiramisu-2436aa.netlify.app/signup): This page create and sign up as a member of the zoo.
- [Edit Member Info](https://glowing-tiramisu-2436aa.netlify.app/member/50/settings): This page is for members to be able edit their information
### Employees
- [Manage employees](https://glowing-tiramisu-2436aa.netlify.app/Admin/45/employeeTable): This is the page where the user can view/add/edit/delete employees. 
- [Manage events](https://glowing-tiramisu-2436aa.netlify.app/Admin/45/events): This is the page where the user can add/delete events
- [Manage Animals](https://glowing-tiramisu-2436aa.netlify.app/Admin/45/animalTable): This is the page where the user can view/add/edit/delete animals.
- [Manage Merchandise](https://glowing-tiramisu-2436aa.netlify.app/Admin/45/giftshopTable): This is the page where the user can view/add/edit/delete merchandise.

## **Triggers**

### Event Creation Trigger
This trigger is designed to send an Email notification when an event is created
```sql
CREATE TRIGGER after_event_insert
AFTER INSERT ON Events
FOR EACH ROW
BEGIN
    DECLARE eventSubject VARCHAR(255);
    DECLARE eventMessage TEXT;

    SET eventSubject = CONCAT('Notification: New Event "', NEW.eventName, '" has been scheduled');
    SET eventMessage = CONCAT('A new event "', NEW.eventName, '" has been scheduled for ', NEW.eventTime, '. Don\'t miss out!');

    -- Notify Marketing Employees
    INSERT INTO Email_notifications (recipientEmail, subject, message)
    SELECT email, eventSubject, eventMessage
    FROM Employees
    WHERE departmentID = (SELECT departmentID FROM Departments WHERE DepartmentName = 'Marketing' LIMIT 1);
END //
```

### Event Cancellation Trigger
This trigger is designed to send an Email notification when an event is deleted
```sql
after_event_delete
CREATE TRIGGER after_event_delete
AFTER DELETE ON Events
FOR EACH ROW
BEGIN
    DECLARE eventSubject VARCHAR(255);
    DECLARE eventMessage TEXT;

    SET eventSubject = CONCAT('Notification: Event "', OLD.eventName, '" has been cancelled');
    SET eventMessage = CONCAT('We regret to inform you that the event "', OLD.eventName, '" scheduled on ', OLD.eventTime, ' has been cancelled.');

    -- Notify Administration Employees
    INSERT INTO Email_notifications (recipientEmail, subject, message)
    SELECT email, eventSubject, eventMessage
    FROM Employees
    WHERE departmentID = (SELECT departmentID FROM Departments WHERE DepartmentName = 'Administration' LIMIT 1);
END //  
```

### Membership Expiring Trigger
This trigger is designed to notify a member that their membership is expiring within 5 days
```sql
CREATE TRIGGER check_membership_expiry 
BEFORE UPDATE ON Members
FOR EACH ROW
BEGIN
    DECLARE end_date DATE;

    -- Calculate membership end date based on memberTerm
    SET end_date = CASE NEW.memberTerm
        WHEN 0 THEN DATE_ADD(NEW.subscribed_on, INTERVAL 1 MONTH)
        WHEN 1 THEN DATE_ADD(NEW.subscribed_on, INTERVAL 6 MONTH)
        WHEN 2 THEN DATE_ADD(NEW.subscribed_on, INTERVAL 12 MONTH)
        WHEN 3 THEN DATE_ADD(NEW.subscribed_on, INTERVAL 24 MONTH)
        ELSE NULL
    END;

    -- Check if the membership will expire within the next 5 days
    IF end_date IS NOT NULL AND end_date <= DATE_ADD(CURDATE(), INTERVAL 5 DAY) THEN
        -- Set expiry notification message
        SET NEW.expiry_notification = 'Membership ending within 5 days';
    ELSE
        SET NEW.expiry_notification = NULL; -- Clear notification if not applicable
    END IF;
END //
```

## **Queries**
We have several queries that let us view information about the zoo along with queries for reports here are just some of those examples
### Get All Events Query:
- This query is from the event calendar to pull all the events from the database to show them on the calendar.
```sql
SELECT * 
FROM Events
ORDER BY eventTime ASC`
```

### Add new animals Query:
-  This query is an insert query to add new animals into the database
```sql
INSERT INTO Animals (name, sex, date_acquired, date_died, date_born, species, classification, enclosureID)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)`
```
each "?" corresponds with each attribute and is set when the add animals form is populated with the corresponding information

### Feeding Report Query:
- This query is to see the report of the feeding information of the animals in the zoo along with what enclosure they are in and who is their primary caretaker
```sql
SELECT DISTINCT
en.enclosureID,
en.enclosureName AS Enclosure_Name,
a.name AS Animal_Name,
a.species AS Animal_Species,
fs.feedingType AS Feeding_Type,
fs.feedingFreq AS Feeding_Frequency,
fs.last_fed AS Last_Fed_Time,
CONCAT(emp.fName, ' ', emp.lName) AS Caretaker_Name
FROM Enclosures en
LEFT JOIN Animals a ON en.enclosureID = a.enclosureID
LEFT JOIN Feeding_schedules fs ON a.animalID = fs.animalID
LEFT JOIN Employees emp ON fs.caretakerID = emp.employeeID
```

### 
## **Reports**



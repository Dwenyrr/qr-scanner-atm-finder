# qr-scanner-atm-finder
School project: Mobile application for scanning QR-codes and locating nearest ATM.<br/>
Developed with **React Native, React Native Paper** and **Expo Camera and Location components**.

## Functionality:
This application consists of two small separate applications:<br/>
**1. QR-browser**
   * QR-codes can be scanned inside the application with the Expo Camera
   * After the QR-code is scanned, the validity of the scanned url is checked.
   * If the scanned url is valid, the web page is opened inside the application using the WebView-component.

![image](https://github.com/user-attachments/assets/f717e75a-4ea7-49b6-af2e-8c7e099ca81b)

  
**2. Closest ATM locator**
  * By pressing a button, the application gives the address, postal code and city of the nearest ATM machine
  * The application also gives the straight line distance from the users location to the nearest ATM
  * Expo location component is used for getting the location of the user
  * The ATM location data is saved as JSON as a part of the source code

![image](https://github.com/user-attachments/assets/70bed966-1c92-4799-ac64-dbdedb3409a7)


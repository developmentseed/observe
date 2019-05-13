# Observe v0.1 User Guide

## Outline
1. Introduction
2. Getting around Observe
3. Viewing feature details
4. Adding a point
5. Editing an existing feature
6. Offline mapping
7. Managing your edits


## 1. Introduction

Observe is a field mapping tool for OSM that supports offline mapping. Observe is built to make the process of mobile editing simple through careful user interface and usability design.

![](https://paper-attachments.dropbox.com/s_F93699907F08C9A5CFEA336B060601FC1F56081D6CDCD065E76BFC67A1561305_1555325814694_Screenshot_1555325690.png)
![](https://paper-attachments.dropbox.com/s_F93699907F08C9A5CFEA336B060601FC1F56081D6CDCD065E76BFC67A1561305_1555325852187_Screenshot_1555325696.png)

Observe allows the mapper to create new `nodes`, and modify or delete existing `ways`. Observe v0.1.0 does not support creating ways and editing `relations`. This version of Observe supports downloading map data for offline mapping, and upload edits when the mapper is back online.
 
Observe v0.1.0 works on Android 5 and above, and iOS.


## 2. Getting around Observe

Observe has a simple interface that uses components that mobile phone map users are already familiar with. The application has the following screens that provide different functionality:

### Explore 
When Observe starts, it takes the user to the Explore screen with a map of the user’s current location. The map has controls to change the base layer between raster map and satellite imagery, as well as a locate button that sets the map view back to the user’s location.

![](https://paper-attachments.dropbox.com/s_F93699907F08C9A5CFEA336B060601FC1F56081D6CDCD065E76BFC67A1561305_1555326584074_Screenshot_1555325690.png)


### Your Contributions
This screen will list all the edits made by the user through Observe, and allow them to view, manage, and discard edits. 

![](https://paper-attachments.dropbox.com/s_F93699907F08C9A5CFEA336B060601FC1F56081D6CDCD065E76BFC67A1561305_1555328761384_Screenshot_1555328738.png)


### Offline Maps
Offline map data is managed through this screen. The user can see a list of all available AOIs, create new ones, and delete existing AOI if they are no longer needed.

![](https://paper-attachments.dropbox.com/s_F93699907F08C9A5CFEA336B060601FC1F56081D6CDCD065E76BFC67A1561305_1555326481037_Screenshot_1555326442.png)


### Account
The Account screen allows the user to sign-in to OSM and see their account information, and also logout when required.

![](https://paper-attachments.dropbox.com/s_F93699907F08C9A5CFEA336B060601FC1F56081D6CDCD065E76BFC67A1561305_1555328864874_Screenshot_1555328801.png)


### Settings
This screen displays some advanced data management functions, only to be used if Observe is unable to function due to an unknown error. 

![](https://paper-attachments.dropbox.com/s_F93699907F08C9A5CFEA336B060601FC1F56081D6CDCD065E76BFC67A1561305_1555328910197_Screenshot_1555328894.png)

## 3. Viewing feature details

On the Explore screen, pressing on a feature will bring up a drawer indicating all selected features. The user can choose the feature from the drawer to see the details. 

![](https://paper-attachments.dropbox.com/s_F93699907F08C9A5CFEA336B060601FC1F56081D6CDCD065E76BFC67A1561305_1555329580070_Kapture+2019-04-15+at+17.29.27.gif)


## 4. Adding a point

- To add a point, click the ‘+’ button
- Move the crosshair to the desired location
- Press the ‘tick’ button to confirm
- Then select the preset by searching or selecting a default one. The search includes commonly used point presets from iD
- Once a preset is selected, add all the tag information
- You can use the ‘Additional Tags’ option to add any tags that are not already captured by fields. 
- Once editing is done, press the ‘tick’ button to confirm
- Add an optional changeset comment, and press save
- The changeset will be uploaded immediately if there’s network connectivity, or stored and uploaded at a later time

![s_F93699907F08C9A5CFEA336B060601FC1F56081D6CDCD065E76BFC67A1561305_1555328714010_Kapture+2019-04-15+at+17 14 59](https://user-images.githubusercontent.com/371666/57284637-34546c80-70cf-11e9-8075-d434080f6ed6.gif)




## 5. Editing an existing feature
- Select the feature to edit from the map, and then from the drawer after confirming the details
- Press the ‘pencil’ button to start editing
- Edit attributes by adding new fields, removing existing tags, or introducing additional tags
- To change the preset of the feature, press the preset icon. Then follow steps similar to Adding a point
- To change the location of the feature (only for Points), press ‘Edit coordinates’. Move the crosshair to the desired location, and confirm by pressing the ‘tick’ button
- When done editing, press the ‘tick’ button, enter an optional changeset comment, and press save

![](https://paper-attachments.dropbox.com/s_F93699907F08C9A5CFEA336B060601FC1F56081D6CDCD065E76BFC67A1561305_1555328953699_Kapture+2019-04-15+at+17.10.55.gif)



## 6. Offline mapping

Observe allows the user to store OSM data, map and satellite tiles for offline mapping. The changesets created while offline are stored on device, and will be uploaded once the user is back online. To download data for an AOI:

### Downloading a new AOI

- Navigate to the ‘Offline Maps’ screen using the menu
- Press the ‘download’ button
- Adjust the map view to the desired AOI. Observe supports downloading up to 400 sq. km.
- Press the ‘tick’ button to start the download
- The download will happen in the background. You can see the status of the download right in the Offline Map screen


![](https://paper-attachments.dropbox.com/s_F93699907F08C9A5CFEA336B060601FC1F56081D6CDCD065E76BFC67A1561305_1555326281469_Kapture+2019-04-15+at+16.33.50.gif)


### Updating and deleting an AOI

- To update an existing AOI, navigate to that AOI through the Offline Maps screen
- Then press the ‘refresh’ button. This will refresh the entire AOI
- If the user pans over an AOI that has been cached for over 24 hours, the region viewed by the user will be refreshed. This doesn’t guarantee refreshing the entire AOI

![](https://paper-attachments.dropbox.com/s_F93699907F08C9A5CFEA336B060601FC1F56081D6CDCD065E76BFC67A1561305_1555326405605_Screenshot_1555326353.png)



## 7. Managing your edits

Edits made by the user through Observe are managed via the Your Contributions screen. The user can see the status of every edit and retry, resolve conflicts, or discard pending edits. 

### Resolving conflicts

- When a feature you edited while offline has changed upstream, there will be a conflict. The Your Contributions screen will inform you of an upload failed due to a conflict. 
- In case of a conflict, you can discard your edit, or overwrite after comparing the changes

![](https://paper-attachments.dropbox.com/s_F93699907F08C9A5CFEA336B060601FC1F56081D6CDCD065E76BFC67A1561305_1555327975712_screenshot1-resized.png)


### Retrying uploads

- Some changesets may not be uploaded immediately, perhaps due to network or authentication errors
- You can retry uploading all of them, or by one by one from the Your Contributions screen

![](https://paper-attachments.dropbox.com/s_F93699907F08C9A5CFEA336B060601FC1F56081D6CDCD065E76BFC67A1561305_1555329065595_resized-contributions-pending.png)


### Removing edits and inspecting errors

- In case Observe fails to upload a changeset with an error that cannot be retried, a detailed log of the error is displayed for reporting. You can decide whether to force a retry of the upload, or safely discard it.

![](https://paper-attachments.dropbox.com/s_F93699907F08C9A5CFEA336B060601FC1F56081D6CDCD065E76BFC67A1561305_1555329050742_resized-contributions-error.png)


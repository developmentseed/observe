# Observe v0.2-rc User Guide

## Outline
1. Introduction
2. Getting around Observe
3. Viewing feature details
4. Adding a point
5. Editing an existing feature
6. Offline mapping
7. Managing your edits
8. Authenticating with Observe API
9. Taking photos
10. Taking photos associated to map features
11. Recording GPS traces


## 1. Introduction

Observe is a field mapping tool for OSM that supports offline mapping. Observe is built to make the process of mobile editing simple through careful user interface and usability design.

<img width="373" alt="Observe_explore-sat" src="https://user-images.githubusercontent.com/12634024/83361343-4c400380-a356-11ea-8069-d09556a46337.png">



Observe allows the mapper to create new `nodes`, and modify or delete existing `ways`. Observe v0.1.0 does not support creating ways and editing `relations`. This version of Observe supports downloading map data for offline mapping, and upload edits when the mapper is back online.
 
Observe v0.1.0 works on Android 5 and above, and iOS.


## 2. Getting around Observe

Observe has a simple interface that uses components that mobile phone map users are already familiar with. The application has the following screens that provide different functionality:

### Explore 
When Observe starts, it takes the user to the Explore screen with a map of the user’s current location. The map has controls to change the base layer between raster map and satellite imagery, as well as a locate button that sets the map view back to the user’s location.

<img width="273" alt="Observe_explore" src="https://user-images.githubusercontent.com/12634024/83361359-6e398600-a356-11ea-839b-b6218e20209f.png">


### Your Contributions
This screen will list all the edits made by the user through Observe, and allow them to view, manage, and discard edits. 

![](https://paper-attachments.dropbox.com/s_F93699907F08C9A5CFEA336B060601FC1F56081D6CDCD065E76BFC67A1561305_1555328761384_Screenshot_1555328738.png)


### Offline Maps
Offline map data is managed through this screen. The user can see a list of all available AOIs, create new ones, and delete existing AOI if they are no longer needed.

<img width="273" alt="Observe_offline1" src="https://user-images.githubusercontent.com/12634024/83361400-b22c8b00-a356-11ea-950e-994e73b944b9.png">


### Account
The Account screen allows the user to sign-in to OSM and see their account information, and also logout when required.

<img width="273" alt="Observe_account-in" src="https://user-images.githubusercontent.com/12634024/83361408-bf497a00-a356-11ea-97f2-cbb7d24b0b76.png">


### Settings
This screen displays some advanced data management functions, only to be used if Observe is unable to function due to an unknown error. 

<img width="273" alt="Observe_settings" src="https://user-images.githubusercontent.com/12634024/83361438-fc157100-a356-11ea-9475-c61b451c3d52.png">

## 3. Viewing feature details

On the Explore screen, pressing on a feature will bring up a drawer indicating all selected features. The user can choose the feature from the drawer to see the details. 

![](https://paper-attachments.dropbox.com/s_F93699907F08C9A5CFEA336B060601FC1F56081D6CDCD065E76BFC67A1561305_1555329580070_Kapture+2019-04-15+at+17.29.27.gif)


## 4. Adding a point

- To add a point, click the ‘+’ button, then click "Add Point"
- Move the crosshair to the desired location
- Press the ‘tick’ button to confirm
- Then select the preset by searching or selecting a default one. The search includes commonly used point presets from iD
- Once a preset is selected, add all the tag information
- You can use the ‘Additional Tags’ option to add any tags that are not already captured by fields. 
- Once editing is done, press the ‘tick’ button to confirm
- Add an optional changeset comment, and press save
- The changeset will be uploaded immediately if there’s network connectivity, or stored and uploaded at a later time

![AddPoint-treeSat](https://user-images.githubusercontent.com/12634024/83361484-544c7300-a357-11ea-8d2b-a5286addd607.gif)

## 5. Add a way
- To add a point, click the '+' button, then cilck "Add Way"
- Move the crosshair to the position of the first node
- Press the '+' button in the ways menu on the bottom of the screen
- To add more nodes, simply drag the cursor on the screen to each new node point
- Click the trash can icon to delete nodes, the undo icon to undo nodes, and the redo icon to redo undone nodes
- Press the 'tick' button to finish your new way
- Then select the preset by searching or selecting a default one. The search includes commonly used way presets from iD
- Once a preset is selected, add all the tag information
- You can use the ‘Additional Tags’ option to add any tags that are not already captured by fields. 
- Once editing is done, press the ‘tick’ button to confirm
- Add an optional changeset comment, and press save
- The changeset will be uploaded immediately if there’s network connectivity, or stored and uploaded at a later time

![AddWay](https://user-images.githubusercontent.com/12634024/83361525-c91fad00-a357-11ea-9df7-1b47b89c8565.gif)

## 6. Editing an existing feature
- Select the feature to edit from the map, and then from the drawer after confirming the details
- Press the ‘pencil’ button to start editing
- Edit attributes by adding new fields, removing existing tags, or introducing additional tags
- To change the preset of the feature, press the preset icon. Then follow steps similar to Adding a point
- To change the location of the feature (only for Points), press ‘Edit coordinates’. Move the crosshair to the desired location, and confirm by pressing the ‘tick’ button
- When done editing, press the ‘tick’ button, enter an optional changeset comment, and press save

![](https://paper-attachments.dropbox.com/s_F93699907F08C9A5CFEA336B060601FC1F56081D6CDCD065E76BFC67A1561305_1555328953699_Kapture+2019-04-15+at+17.10.55.gif)



## 7. Offline mapping

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



## 8. Managing your edits

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

### Logging into the Observe API
Observe API (which is optional to use Observe Mobile) uses the same authentication system as Observe Mobile. However, the user will have to authenticate from the Account screen to upload photos and traces.

![Screenshot_1575989165](https://user-images.githubusercontent.com/371666/70539879-4aa53800-1b8a-11ea-8286-1c06a38f5a67.png)



### Take a photo
- To take a photo at any time while using Observe, press the camera button on the main screen.
- Then take a picture and enter an optional description
- If authenticated with the Observe API, photos will be automatically uploaded. Otherwise, you can retry uploading from the Your Photos screen

![take-photo](https://user-images.githubusercontent.com/371666/70525686-e4aab780-1b6d-11ea-8a75-e43155d5367e.gif)

### Take the photo of a feature

- Observe allows the user to take a picture associated with a map feature
- To take a photo of a feature, select the feature from the map, and then press on the camera icon
- Add a description, and press the tick icon to save
- Once uploaded to the Observe API, these photos can be viewed and downloaded through the Dashboard for further editing

![take-photo-feature](https://user-images.githubusercontent.com/371666/70525815-30f5f780-1b6e-11ea-9ed5-9294a787d00e.gif)


### Recording a GPS Track

- To record a GPS Track, press the record button on the main screen
- This will start recording points as you move
- Once done, press stop to save
- You can pause the recording for as long as needed or discard the trace if you wish to

![record-trace](https://user-images.githubusercontent.com/371666/70527045-f5106180-1b70-11ea-8029-ab5a31cde1b1.gif)

# Observe Dashboard v0.1

The Observe Dashboard will show all photos and traces uploaded by users of the Observe Mobile.

## Working with Photos

![image](https://user-images.githubusercontent.com/371666/70527352-bc24bc80-1b71-11ea-8d89-2e3e420864f7.png)
_List of photos uploaded from Observe Mobile_

### Filters
Users can filter photos using username, date range, associated map feature type, or map feature ID.

![image](https://user-images.githubusercontent.com/371666/70527613-55ec6980-1b72-11ea-9d8f-cacecd5a2a32.png)
_Applying filters_

### View details and other actions
The photo detail page will show the ID, description and other metadata. Users can download or edit the photo, and also view the associated feature if there is any.

![image](https://user-images.githubusercontent.com/371666/70530870-d19de480-1b79-11ea-92d7-9967879b04b3.png)


## Working with Traces
![image](https://user-images.githubusercontent.com/371666/70531117-496c0f00-1b7a-11ea-8964-864c94e5446a.png)
_List of traces uploaded from Observe Mobile_

### Filters
Users can filter traces using username, date, or length.
![image](https://user-images.githubusercontent.com/371666/70531230-7cae9e00-1b7a-11ea-8ead-a0dba32f7e71.png)


### View details and other actions
The trace detail page will show a map of the trace and related metadata. Users can also open the trace directly in JOSM ([via Remotecontrol](https://wiki.openstreetmap.org/wiki/JOSM/RemoteControl)).

![image](https://user-images.githubusercontent.com/371666/70531260-8f28d780-1b7a-11ea-912f-d8fb94733f64.png)

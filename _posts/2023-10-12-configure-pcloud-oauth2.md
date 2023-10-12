---
title: Configure pCloud OAuth2
date: 2023-10-12 12:00:00 +0200
categories: howto
tags: automation backup pCloud oauth2
---

## Configure pCloud OAuth2
1. Open the OAuth2 app page:
https://docs.pcloud.com/my_apps/
1. Create a new app.
![Selection_013.png](c/2023/10/12/Selection_013.png)
1. Open the settings.
![Selection_014.png](§/2023/10/12/Selection_014.png)
1. Configure the redirect URI.
![Selection_017.png](/assets/img/blog/2023/10/12/Selection_017.png)
1. Create the root folder in my.pcloud.com.
![Selection_015.png](/assets/img/blog/2023/10/12/Selection_015.png)
1. Copy new folder's ID from the URL.
![Selection_018.png](/assets/img/blog/2023/10/12/Selection_018.png)

## Configure rclone
On a machine with a web browser, install rclone and launch `rclone config`.

1. Create a new remote.
```
e) Edit existing remote
n) New remote
d) Delete remote
r) Rename remote
c) Copy remote
s) Set configuration password
q) Quit config
e/n/d/r/c/s/q> n
```

1. Name the new remote.
```
name> pcloud_backup
```

1. Select 25 for pCloud storage.
```
Type of storage to configure.
Enter a string value. Press Enter for the default ("").
Choose a number from below, or type in your own value
 1 / 1Fichier
   \ "fichier"
 2 / Alias for an existing remote
   \ "alias"
 3 / Amazon Drive
   \ "amazon cloud drive"
 4 / Amazon S3 Compliant Storage Provider (AWS, Alibaba, Ceph, Digital Ocean, Dreamhost, IBM COS, Minio, Tencent COS, etc)
   \ "s3"
 5 / Backblaze B2
   \ "b2"
 6 / Box
   \ "box"
 7 / Cache a remote
   \ "cache"
 8 / Citrix Sharefile
   \ "sharefile"
 9 / Dropbox
   \ "dropbox"
10 / Encrypt/Decrypt a remote
   \ "crypt"
11 / FTP Connection
   \ "ftp"
12 / Google Cloud Storage (this is not Google Drive)
   \ "google cloud storage"
13 / Google Drive
   \ "drive"
14 / Google Photos
   \ "google photos"
15 / Hubic
   \ "hubic"
16 / In memory object storage system.
   \ "memory"
17 / Jottacloud
   \ "jottacloud"
18 / Koofr
   \ "koofr"
19 / Local Disk
   \ "local"
20 / Mail.ru Cloud
   \ "mailru"
21 / Microsoft Azure Blob Storage
   \ "azureblob"
22 / Microsoft OneDrive
   \ "onedrive"
23 / OpenDrive
   \ "opendrive"
24 / OpenStack Swift (Rackspace Cloud Files, Memset Memstore, OVH)
   \ "swift"
25 / Pcloud
   \ "pcloud"
26 / Put.io
   \ "putio"
27 / SSH/SFTP Connection
   \ "sftp"
28 / Sugarsync
   \ "sugarsync"
29 / Transparently chunk/split large files
   \ "chunker"
30 / Union merges the contents of several upstream fs
   \ "union"
31 / Webdav
   \ "webdav"
32 / Yandex Disk
   \ "yandex"
33 / http Connection
   \ "http"
34 / premiumize.me
   \ "premiumizeme"
35 / seafile
   \ "seafile"
Storage> 25
** See help for pcloud backend at: https://rclone.org/pcloud/ **
```

1. Copy the client ID of your new pCloud app.
```
Auth Client Id
Leave blank normally.
Enter a string value. Press Enter for the default ("").
client_id> zQg0smNw8tp
```

1. Copy the client secret of your new pCloud app.
```
OAuth Client Secret
Leave blank normally.
Enter a string value. Press Enter for the default ("").
client_secret> 2OSmU2xW6gYaLLCaPPIUg5T5EvX7
```

1. Edit the advanced settings.
```
Edit advanced config? (y/n)
y) Yes
n) No (default)
y/n> y
```

1. Press `Enter` until you get to the `root_folder_id`. Copy your folder ID from the pCloud folder which will serve as root for the application.
```text
OAuth Access Token as a JSON blob.
Enter a string value. Press Enter for the default ("").
token> 
Auth server URL.
Leave blank to use the provider defaults.
Enter a string value. Press Enter for the default ("").
auth_url> 
Token server url.
Leave blank to use the provider defaults.
Enter a string value. Press Enter for the default ("").
token_url> 
This sets the encoding for the backend.
-
See: the [encoding section in the overview](/overview/#encoding) for more info.
Enter a encoder.MultiEncoder value. Press Enter for the default ("Slash,BackSlash,Del,Ctl,InvalidUtf8,Dot").
encoding> 
Fill in for rclone to use a non root folder as its starting point.
Enter a string value. Press Enter for the default ("d0").
root_folder_id> 19066333043
```

1. Choose your region.
```
Hostname to connect to.
-
This is normally set when rclone initially does the oauth connection,
however you will need to set it by hand if you are using remote config
with rclone authorize.
-
Enter a string value. Press Enter for the default ("api.pcloud.com").
Choose a number from below, or type in your own value
 1 / Original/US region
   \ "api.pcloud.com"
 2 / EU region
   \ "eapi.pcloud.com"
hostname> 1
```

1. On the pCloud API, set the redirect URI to `http://localhost:53682/`.
```
Remote config
Make sure your Redirect URL is set to "http://localhost:53682/" in your custom config.
Use auto config?
 * Say Y if not sure
 * Say N if you are working on a remote or headless machine
y) Yes (default)
n) No
y/n> 
If your browser doesn't open automatically go to the following link: http://127.0.0.1:53682/auth?state=-9WXa5fWne_0d-1IQYvwbQ
Log in and authorize rclone for access
Waiting for code...
```

1. Your default browser should open, connect to your account.
![Selection_019.png](/assets/img/blog/2023/10/12/Selection_019.png)

1. Allow the app to access.
![Selection_020.png](/assets/img/blog/2023/10/12/Selection_020.png)

1. The redirection should show you a simple success page.
![Selection_021.png](/assets/img/blog/2023/10/12/Selection_021.png)

1. Close the browser window and return to rclone config.
```
Got code
--------------------
[pcloud_backup]
client_id = zQg0smNw8tp
client_secret = 2OSmU2xW6gYaLLCaPPIUg5T5EvX7
root_folder_id = 19066333043
hostname = api.pcloud.com
token = {"access_token":"AxavZzQg0smNw8tpZcyLMykZYw84XRDMtlJWkrQrRiMBc8V9dJc7","token_type":"bearer","expiry":"0001-01-01T00:00:00Z"}
--------------------
y) Yes this is OK (default)
e) Edit this remote
d) Delete this remote
y/e/d> y
```

## Verify your settings in pCloud

1. Open pCloud "Settings -> Linked Accounts".
https://my.pcloud.com/#page=settings&settings=tab-apps

1. In the __Linked Apps__ section you will find your application and you can see it's limited to a specific folder.
![Selection_022.png](/assets/img/blog/2023/10/12/Selection_022.png)

## References
- https://docs.pcloud.com/methods/oauth_2.0/
- https://pypi.org/project/pcloud/
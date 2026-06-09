> **Hinweis / Notice:** Dieses Repository ist nach Forgejo umgezogen und wird auf GitHub nicht mehr gepflegt.  
> This repository has moved to Forgejo and is no longer maintained on GitHub.  
>  
> **Aktuelle Version / Current version:**  
> https://git.friendica.dev/Jools/fedilive-comments

#  FediLive Comments

Mit diesem Script lassen sich Kommentare aus Friendica direkt in den eigenen Blog integrieren. Dabei werden bewusst keine Daten gespeichert, die Kommentare werden bei jedem Aufruf der Webseite erneut abgerufen.

---

##  Features

* **Live-Abruf:** Kommentare werden bei jedem Seitenaufruf direkt von der Quelle geholt.
* **Zero Storage:** Dein Server speichert keine fremden IP-Adressen oder Texte dauerhaft.

---




## Deutsche Anleitung

**1. Backend-Vorbereitung (Proxy)**
Die Datei `fedi-proxy.php` in das Hauptverzeichnis hochladen (wo z.B. die index.html liegt). Wichtig: Zuvor muss in dieser Datei bei `$host` die eigene Friendica-Instanz eingetragen werden.



**2. Frontend-Einbindung (Widget)**

***Entweder (Einfach):***
Inhalt der `fedi-comments-widget.html` kopieren. Diesen Code in das Website-Template an der Stelle einfügen, wo die Kommentare erscheinen sollen. Publii-Nutzer: Den Inhalt von fedi-comments-widget.html unter
"Werkzeuge & Plugins" -> "Benutzerdefiniertes HTML" -> "Kommentare" einfügen.

***Oder (Getrennte Dateien):***
Die Dateien `fedi-comments.css` und `fedi-comments.js` hochladen und in das Website-Template einbinden, dann zusätzlich den Platzhalter-Container an der Stelle einfügen, an der die Kommentare erscheinen sollen:

    <!-- 1. CSS im <head> einbinden -->
    <link rel="stylesheet" href="fedi-comments.css">
    
    <!-- 2. Platzhalter im <body> einfügen -->
    <div id="fediverse-comments-area"></div>
    
    <!-- 3. JS am Ende des <body> einbinden -->
    <script src="fedi-comments.js" defer></script>

   

**3. Beiträge verknüpfen**
Sobald ein neuer Blog-Beitrag veröffentlicht und im Fediverse geteilt wurde, wird das Script nun wie folgt verknüpft:
 
- ID des Fediverse-Beitrags herausfinden: Auf das Datum des Fediverse-Artikels klicken, danach in Friendica den Quelltext dieser Seite anzeigen und nach dem Atom-Feed suchen (ca. Zeile 200): 
 `<link href="display/feed-item/xxxxxxx.atom" rel="alternate" type="application/atom+xml">` 
Das xxxxxxx ist hier die uri_id.
- Zurück zum gerade geschriebenen Blogbeitrag gehen (z.B. in Publii) und dort im HTML-Quelltext an der Stelle, wo die Kommentare angezeigt werden sollen, folgende Zeile einfügen:
`<div data-fedi-id="xxxxxxx"> </div>` Die Zahl `xxxxxxx` ist hier die uri_id des Blog-Beitrags aus Friendica, die aus dem Quellcode ausgelesen wurde.
Nun den Blogbeitrag erneut speichern (in Publii danach auf "Webseite synchronisieren" klicken). Ab jetzt werden Likes, Shares und Kommentare aus dem Fediverse unter diesem Beitrag im Blog angezeigt.


---


## English Instructions

**1. Backend Setup (Proxy)**
-   Upload `fedi-proxy.php` to your root directory.
-   Important: Open the file and enter your instance domain in the `$host` variable.



**2. Frontend Integration (Widget)**

***Option A (Simple):***
Copy the content of `fedi-comments-widget.html`. Paste this code into your template where the comments should appear. Publii Users: Paste it under "Tools & Plugins" -> "Custom HTML" -> "Comments".

***Option B (Separate Files):***  
Upload `fedi-comments.css` and `fedi-comments.js` to your server and link them in your template. Also, add the placeholder container where you want the comments to be displayed:


    <!-- 1. Link CSS in your <head> -->  
    <link rel="stylesheet" href="fedi-comments.css">
    
    <!-- 2. Add placeholder in your <body> -->  
    <div id="fediverse-comments-area"></div>
    
    <!-- 3. Link JS at the end of your <body> -->  
    <script src="fedi-comments.js" defer></script>

   
   

**3. Linking Posts**
 Once a post is published and shared on the Fediverse, link it like this:

- **Find the ID:** Click the date of your post in Friendica. View the page source and look for the Atom feed link:
 `<link href="display/feed-item/xxxxxxx.atom" rel="alternate" type="application/atom+xml">` 
The number xxxxxxx is your uri_id.
    
-   **Add to Post:** In your blog post (HTML editor), add the following line at the very end:
`<div data-fedi-id="xxxxxxx"> </div>`

-   **Deploy:** Save and sync your site. Fediverse interactions will now appear live.



# ArachnePy

Mit dem Modul wird der Zugriff auf den dMLW-Server vereinfacht. Die Daten werden in einer lokalen SQLite3 Datenbank gespeichert.


## Erste Schritte
```
from arachne import Arachne

arachne = Arachne("email", "passwort", "host", ["work"])
print(arachne.work.get({"id": 1}, ["ac_vsc"]))
arachne.close()
```

Mit dem Erstellen des Objekts wird eine Verbindung zum Server aufgenommen und ein Token für den Zugriff erstellt und gespeichert. Die Tabellen sind als Attribute des Objekts verfügbar.

## Funktionen
### Arachne('Email', 'Passwort', 'Host', 'Tabellen' = "*", 'Zurücksetzen' = False)
Bereits beim Erstellen des Objekts wird eine Session auf dem Server reserviert und das Token gespeichert. Die lokale Datenbank wird erstellt ('arachne.db') und aktualisiert.
    - 'Email': eine gültige Email-Adresse
    - 'Passwort': ein gültiges Passwort.
    - 'Host': z.B. 'https://dienste.badw.de:9999'
    - 'Tabellen': Kann eine Liste mit gewünschten Tabellen sein (z.B. ["work"]). Wenn es leergelassen wird, werden alle verfügbaren Tabellen heruntergeladen.
    - 'Zurücksetzen': Wenn True, wird die lokale Datenbank gelöscht.


### Arachne.close()
Beendet die aktuelle Session und löscht das Token auf dem Server.


### Arachne.*Tabellenname*.delete('ID')
Löscht den Datensatz mit der angegebenen ID. Wenn das Löschen erfolgreich war, wird 200 zurückgegeben.

### Arachne.*Tabellenname*.describe()
Gibt das Schema der aktuellen Tabelle aus der **lokalen Datenbank** als Liste wieder.

### Arachne.*Tabellenname*.save({'neue Werte'})
Speichert die neuen Werte, welche in Form eines dictionary angegeben werden müssen. Wenn ein Schlüssel "id" enthalten ist, wird der Datensatz mit der entsprechenden ID aktualisiert, wenn der Schlüssel fehlt, wird ein neuer Datensatz erstellt. Es wird der Status Code der Serveranfrage zurückgegeben (200 = Datensatz aktualisiert; 201 = neuer Datensatz erstellt).

### Arachne.*Tabellenname*.search({'Suchanfrage'} = "\*", ['Rückgabespalten'] = "\*", ['ordnen nach'] = None)
Sucht in der lokalen Datenbank nach dem in de Suchanfrage gegebenen Werten. Eine Liste mit dictionaries wird zurückgegeben. Wenn eine Suchanfrage ausgelassen wird, werden alle Datensätze zurückgegeben.
- 'Suchanfrage': Wenn angegeben, muss es ein dictionary sein, mit den Schlüsseln entsprechende der Tabellen-Spalten. Die Werte können mit den Vorzeichen "<", ">" und "-" gesteuert werden. Ein Stern "\*" kann als Platzhalter für keines oder mehrere Zeichen verwendet werden.
- 'Rückgabespalten': Wenn nicht angegben, werden alle verfügbaren Spalten zurückgegeben. Sonst muss es eine Liste von Strings sein.
- 'ordnen nach': Kann eine Liste von Spalten sein, nach denen die Suchergebnisse geordnet werden sollen.

```
arachne.lemma.search({"id": ">100"}) // alle Datensätze mit einer ID grösser als 100.
arachne.lemma.search({"id": "<100"}) // alle Datensätze mit einer ID kleiner als 100.
arachne.lemma.search({"lemma": "-kabrates"}) // alle Datensätze, die nicht den Wert "kabrates" in der Spalte "lemma" haben.
arachne.lemma.search({"lemma": "kab*"}) // alle Datensätze, die in der Spalte "lemma" mit "kab" beginnen.

```

### Arachne.*Tabellenname*.version()
Gibt Informationen über die aktuelle Tabelle aus der **Datenbank auf dem Server** als dictionary mit folgenden Schlüsseln zurück:
- 'max_date': das Aktualisierungsdatum des zuletzt aktualisierten Datensatzes.
- 'length': Anzahl aller Datensätze
- 'describe': Schema der Tabelle auf dem Server.

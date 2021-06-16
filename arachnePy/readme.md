# ArachnePy

Mit dem Modul wird der Zugriff auf den dMLW-Server vereinfacht. Die Daten werden in eine lokale SQLite3 Datenbank gespeichert.


## Erste Schritte
```
import Arachne

arachne = Arachne("email", "passwort", "host", ["work"])
print(arachne.describe())
print(arachne.search("work", {id: 1}))
arachne.close()
```

## Funktionen

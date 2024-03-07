# Admin_crack_login

### Opis programu:
Program `SecureForce` jest narzędziem do przeprowadzania ataków brute force na formularze logowania HTTP. Wykorzystuje słowniki użytkowników i haseł do prób zalogowania się na podanym adresie URL. Program umożliwia konfigurację adresu URL, ścieżek do plików ze słownikami użytkowników i haseł oraz wykorzystuje losowe opóźnienia między próbami logowania w celu uniknięcia wykrycia.

### Jak użyć programu:
1. **Instalacja niezbędnych modułów:** Przed uruchomieniem programu należy zainstalować wymagane moduły za pomocą menedżera pakietów np. npm dla Node.js lub pip dla Pythona. Moduły wymagane do działania programu to: `request-promise`, `progress`, i `chalk`. Można je zainstalować za pomocą komendy:
   ```bash
   npm install request-promise progress chalk
   ```
   lub
   ```bash
   pip install request progress chalk
   ```

2. **Konfiguracja programu:** W pliku `secureforce.js` (lub odpowiednim pliku dla wybranego języka) należy dokonać następujących konfiguracji:
   - Zmienne `httpLoginURL`, `userWordlist`, i `passwordWordlist` określają odpowiednio adres URL formularza logowania HTTP oraz ścieżki do plików ze słownikami użytkowników i haseł. Należy je odpowiednio dostosować do swoich potrzeb.

3. **Uruchomienie programu:** Po skonfigurowaniu programu można go uruchomić za pomocą interpretera dla wybranego języka (Node.js lub Python). Należy użyć odpowiedniej komendy w terminalu:
   ```bash
   node secureforce.js
   ```
   lub
   ```bash
   python secureforce.py
   ```

4. **Obserwowanie wyników:** Program rozpocznie atak brute force na podany formularz logowania HTTP. Wyniki będą na bieżąco wyświetlane w konsoli. Program informuje o znalezieniu poprawnych danych logowania oraz końcowym podsumowaniu liczby sprawdzonych kombinacji.

**Uwaga:** Program `SecureForce` powinien być używany wyłącznie w celach testowych i zgodnie z prawem. Nielegalne użycie tego narzędzia może naruszać prywatność oraz być karalne.
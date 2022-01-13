# Mökkireissu-sovellus

**Ryhmän jäsenet**
- Jesse Salonen
- Valtteri Setälä
- Leevi Sillanpää
- Elias Syrjä

**backend ohjeistusta**

*Kehitys lokaalisti:*

HUOM! Vaatii mongoDB:n asennuksen koneelle. https://www.youtube.com/watch?v=wcx3f0eUiAw

cd backend
npm install
Tarkista, että backend-kansiosta löytyy .env -tiedosto. Jos ei löydy, luo se, ja lisää teksti: DATABASE_URL=DATABASE_URL=mongodb://localhost/mokkireissu
npm run devStart
backend aukeaa http://localhost:3000/

*Kehitys palvelimella (Heroku):*

Koodi Herokun repossa valmiina
backend aukeaa https://mokkireissu.herokuapp.com/
Jos muutoksia backend-koodiin, Jesse voi puskea Herokuun (Herokun käyttö vaatii asennuksen käyttäjän koneelle)

**backend API:n käyttöohjeet:**

*Kaikkien ryhmien hakeminen*
GET

http://localhost:3000/groups
TAI
https://mokkireissu.herokuapp.com/groups

Palauttaa JSON vastauksen, jossa kaikki ryhmät tietoineen

*Tietyn ryhmän hakeminen*
GET

http://localhost:3000/groups/ryhmäkoodi
TAI
https://mokkireissu.herokuapp.com/groups/ryhmäkoodi

Palauttaa JSON vastauksen, jossa ryhmä tietoineen

*Uuden ryhmän luominen*
POST

http://localhost:3000/groups
TAI
https://mokkireissu.herokuapp.com/groups

body:
{
    "groupName": "Tänne ryhmän nimi",
    "memberName": "Tänne käyttäjän nimi"
}

Palauttaa JSON vastauksen, jossa luodun ryhmän tiedot

*Ryhmään liittyminen*
PATCH

http://localhost:3000/groups/ryhmäkoodi
TAI
https://mokkireissu.herokuapp.com/groups/ryhmäkoodi

body:
{
    "memberName": "Tänne liittyvän käyttäjän nimi"
}

Palauttaa JSON vastauksen, jossa tietoa muutoksen onnistumisesta

*Käyttäjäkohtaisten tuotteiden määrän muuttaminen*
PATCH

http://localhost:3000/groups/ryhmäkoodi/käyttäjänimi
TAI
https://mokkireissu.herokuapp.com/groups/ryhmäkoodi/käyttäjänimi

body:
{
    "burgers": Tänne tuotteen määrä ilman heittomerkkejä,
    TAI
    "smallCans": Tänne tuotteen määrä ilman heittomerkkejä,
    TAI
    "bigCans": Tänne tuotteen määrä ilman heittomerkkejä
}

Palauttaa JSON vastauksen, jossa tietoa muutoksen onnistumisesta

*Ryhmän lukitseminen*
PATCH

http://localhost:3000/groups/ryhmäkoodi
TAI
https://mokkireissu.herokuapp.com/groups/ryhmäkoodi

body:
{
    "locked": "true" TAI "false"
}

Palauttaa JSON vastauksen, jossa tietoa muutoksen onnistumisesta

*Ryhmän poistaminen*
DELETE

http://localhost:3000/groups/ryhmäkoodi
TAI
https://mokkireissu.herokuapp.com/groups/ryhmäkoodi

Palauttaa JSON vastauksen, jossa tietoa poiston onnistumisesta
# Social Tabs

Małe, ładne i lekkie zakładki ze serwisami społecznościowymi.

Widgety serwisów są ładowane dopiero po aktywowaniu zakładki przez co nie opóźniają ładowania strony. Cały kod odpowiedzialny za wygląd znajduje się w pliku CSS przez co można łatwo i przyjemnie je zmieniać. Zakładki mogą być otwierane na dwa sposobny: kliknięcie lub wskazanie kursorem.

**[Demo](http://9px.pl/Projects/SocialTabs)**

Wymagania SocialTabs:

- jQuery 1.7+
- CSS3 transitions
- Wszystkie nowoczesne przeglądarki oraz IE8+ bez animacji

## How to
```js
new SocialTabs({
	facebook: 'http://www.facebook.com/FacebookDevelopers', // Link do fanpage
	google:   'https://plus.google.com/+WebUpd8', // Link do strony g+
	twitter:  '354502132461879297', // ID widżetu (https://twitter.com/settings/widgets/new/user)
	youtube:  'google' // Nazwa użytkownika
}, {
	action: 'hover', // hover lub click (domyślnie hover)
	appendDelay: 500, // Opóźnienie wykonania zawartości, najlepiej równe czasowi animacji (domyślnie 500)
	hideDelay: 100, // Opóźnienie ukrycia (tylko dla hover, domyślnie 100)
	showDelay: 200 // Opóźnienie wysunięcia (tylko dla hover, domyślnie 200)
});
```

## License
MIT License.


## Changelog

### 1.0.0
- Initial release
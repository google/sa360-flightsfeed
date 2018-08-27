## Required input tables

The list of tables below explains each of the input table's structure, functionality and columns. Each of these sections represents a separate sheet in the document and their names (as listed below) represent their respective naming on the document. Running the `initSheet` function in the Apps Script on an empty Google Sheets document will auto generate these sheets and their columns, as explained in the setup guide.

### Routes

This is the main sheet that would include the basic O&D details of the specific routes along the status of these routes (on / off).

| Column Name  | Description |
| ------------- | ------------- |
| ORIGIN  | Origin airport code |
| DESTINATION | Destination airport code |
| FLIGHT_TYPE | Type of flight e.g codeshare, online, interline|
| ROUTE_TYPE | Type of route e.g city to city, country to country etc... |
| HAS_FIRST_CLASS |(yes / no) Most flights have business + economy usually, some might have first |
| AIRLINE_TIER | Priority number for this route |
| ENABLED | (yes / no) value denoting whether this route is enabled or disabled can be used to turn ads on and off in DS |


### City_translations

This sheet provides all the necessary translations and language information that gets associated with the routes configuration (by city) for generating route entries in multiple languages and text variations.

| Column Name  | Description |
| ------------- | ------------- |
| AIRPORT_CODE  | Airport code e.g. DXB |
| COUNTRY_CODE  | Country code e.g. UAE |
| LANG  | Language code |
| CITY_NAME  | City name text in the language specified for the row |
| CITY_ALT_NAME  | Alternative name for city |
| CITY_SHORT_NAME  | Shorter name for the city|


### Country_translations

This sheet provides all necessary translations and language information for countries by country code in multiple languages.

| Column Name  | Description |
| ------------- | ------------- |
| COUNTRY_CODE  |  Country code e.g. UAE |
| LANG  |  Language code for the country e.g. EN |
| COUNTRY_NAME  |  Country name in the specified language for that row |
| COUNTRY_ALT_NAME  |  Alternate country name in the specified language for that row |
| COUNTRY_SHORT_NAME  | Short country name in the specified language for that row |
| REGION  |  Region that the country belongs to in the specificed language |


### Country_languages

This sheet specifies the availability of language options by country code including the currency and currency symbols if needed.

| Column Name  | Description |
| ------------- | ------------- |
| COUNTRY_CODE  |  Country code e.g. UAE |
| LANG  |  Language code for the country e.g. EN |
| CURRENCY  |  Currency name relative to the country code |
| CURRENCY_SYMBOL  |  Currency symbol relative to the country code |


### Landing_pages

This sheet specifies the list of unique landing page URLs belonging to a combination of ROUTE, COUNTRY_CODE and LANGUAGE. The data in this sheet is used to attach a unique URL to each generated inventory item

| Column Name  | Description |
| ------------- | ------------- |
| ROUTE  | Origin and destination code combination e.g. JFK-DXB |
| COUNTRY_CODE  |  Country code e.g. UAE |
| LANGUAGE  | Language code for the country e.g. EN |
| SITE_EDITION  | Current version of the site / url for the designated URL. Preferably a number. |
| LANDING_PAGE  | The landing page related to that specific route in a specific language |


### Classes

| Column Name  | Description |
| ------------- | ------------- |
| CLASS_ID  | A unique ID for identifying a ticket class |
| CLASS_CODE  | One word class code e.g. ECONOMY, BUSINESS, etc... |
| CLASS_NAME  |  Descriptive name of the ticket class e.g. Economy, Business etc.. |


## Ouput data structure

The table below summarizes the output table after applying the transformations on the sheet tables about in Big Query. The final table is exported as a CSV file and is made available in Google Cloud Storage. The columns below should be delivered and available for use in templates on Doubleclick Search.

| Column Name  |
| ------------- |
| OFFER_ID |
| ROUTE |
| ORIGIN |
| DEST |
| FLIGHT_TYPE |
| HAS_FIRST_CLASS |
| AIRLINE_TIER |
| ENABLED |
| ORIGIN_COUNTRY_CODE |
| ORIGIN_CITY_NAME_LL |
| ORIGIN_CITY_ALT_NAME_LL |
| ORIGIN_CITY_SHORT_NAME_LL |
| ORIGIN_CITY_NAME_EN |
| ORIGIN_CITY_ALT_NAME_EN |
| ORIGIN_CITY_SHORT_NAME_EN |
| ORIGIN_COUNTRY_NAME_LL |
| ORIGIN_COUNTRY_ALT_NAME_LL |
| ORIGIN_COUNTRY_SHORT_NAME_LL |
| ORIGIN_COUNTRY_NAME_EN |
| ORIGIN_COUNTRY_ALT_NAME_EN |
| ORIGIN_COUNTRY_SHORT_NAME_EN |
| ORIGIN_REGION |
| DEST_COUNTRY_CODE |
| DEST_CITY_NAME_LL |
| DEST_CITY_ALT_NAME_LL |
| DEST_CITY_SHORT_NAME_LL |
| DEST_CITY_NAME_EN |
| DEST_CITY_ALT_NAME_EN |
| DEST_CITY_SHORT_NAME_EN |
| DEST_COUNTRY_NAME_LL |
| DEST_COUNTRY_ALT_NAME_LL |
| DEST_COUNTRY_SHORT_NAME_LL |
| DEST_COUNTRY_NAME_EN |
| DEST_COUNTRY_ALT_NAME_EN |
| DEST_COUNTRY_SHORT_NAME_EN |
| DEST_REGION |
| LANG |
| CURRENCY |
| CURRENCY_SYMBOL |
| SITE_EDITION |
| URL |

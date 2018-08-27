/**
 * Copyright 2018 Google Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * https://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */


/**
 * Composes the full path of a table in BQ
 *
 * @param {string} tableName
 * @return {string} Full BQ table path
 */
function getTablePath_(tableName) {
  return '`' + CONFIG['cloudProjectID'] + '.' + CONFIG['bqDatasetID'] + '.' +
      tableName + '`';
}

/**
 * Returns all the view queries related to the transformation steps to run in
 * BQ
 * @return {object} Objects with queries for each step
 */
function loadViewQueries_() {
  var views = {
    'Step1': 'SELECT ' +
        'Routes.ORIGIN AS ORIGIN, ' +
        'Routes.DESTINATION AS DESTINATION, ' +
        'Routes.FLIGHT_TYPE AS FLIGHT_TYPE, ' +
        'Routes.ROUTE_TYPE AS ROUTE_TYPE, ' +
        'Routes.HAS_FIRST_CLASS AS HAS_FIRST_CLASS, ' +
        'Routes.AIRLINE_TIER AS AIRLINE_TIER, ' +
        'Routes.ENABLED AS ENABLED, ' +
        'OriginCityTrans.COUNTRY_CODE AS ORIGIN_COUNTRY_CODE, ' +
        'DestCityTrans.COUNTRY_CODE AS DEST_COUNTRY_CODE ' +
        'FROM ' + getTablePath_('Routes') + ' AS Routes ' +
        'LEFT JOIN ' + getTablePath_('City_translations') +
        ' AS OriginCityTrans ' +
        'ON ' +
        'Routes.ORIGIN = OriginCityTrans.AIRPORT_CODE ' +
        'LEFT JOIN ' + getTablePath_('City_translations') +
        ' AS DestCityTrans ' +
        'ON ' +
        'Routes.DESTINATION = DestCityTrans.AIRPORT_CODE ' +
        'GROUP BY 1, 2, 3, 4, 5, 6, 7, 8, 9',

    'Step2': 'SELECT ' +
        'RoutesCityTrans.ORIGIN AS ORIGIN, ' +
        'RoutesCityTrans.DESTINATION AS DEST, ' +
        'RoutesCityTrans.FLIGHT_TYPE AS FLIGHT_TYPE, ' +
        'RoutesCityTrans.ROUTE_TYPE AS ROUTE_TYPE, ' +
        'RoutesCityTrans.HAS_FIRST_CLASS AS HAS_FIRST_CLASS, ' +
        'RoutesCityTrans.AIRLINE_TIER AS AIRLINE_TIER, ' +
        'RoutesCityTrans.ENABLED AS ENABLED, ' +
        'RoutesCityTrans.ORIGIN_COUNTRY_CODE AS ORIGIN_COUNTRY_CODE, ' +
        'RoutesCityTrans.DEST_COUNTRY_CODE AS DEST_COUNTRY_CODE, ' +
        'CountryLanguages.LANG AS COUNTRY_LANG, ' +
        'CountryLanguages.CURRENCY AS COUNTRY_CURRENCY, ' +
        'CountryLanguages.CURRENCY_SYMBOL AS COUNTRY_CURRENCY_SYMBOL ' +
        'FROM ' + getTablePath_('Step1') + ' AS RoutesCityTrans ' +
        'JOIN ' + getTablePath_('Country_languages') + ' AS CountryLanguages ' +
        'ON ' +
        'RoutesCityTrans.ORIGIN_COUNTRY_CODE = CountryLanguages.COUNTRY_CODE',

    'Step3': 'SELECT ' +
        'RoutesCityCountryLang.ORIGIN AS ORIGIN, ' +
        'RoutesCityCountryLang.DEST AS DEST, ' +
        'RoutesCityCountryLang.FLIGHT_TYPE AS FLIGHT_TYPE, ' +
        'RoutesCityCountryLang.ROUTE_TYPE AS ROUTE_TYPE, ' +
        'RoutesCityCountryLang.HAS_FIRST_CLASS AS HAS_FIRST_CLASS, ' +
        'RoutesCityCountryLang.AIRLINE_TIER AS AIRLINE_TIER, ' +
        'RoutesCityCountryLang.ENABLED AS ENABLED, ' +
        'RoutesCityCountryLang.ORIGIN_COUNTRY_CODE AS ORIGIN_COUNTRY_CODE, ' +
        'CityTransOrigin.CITY_NAME AS ORIGIN_CITY_NAME, ' +
        'CityTransOrigin.CITY_ALT_NAME AS ORIGIN_CITY_ALT_NAME, ' +
        'CityTransOrigin.CITY_SHORT_NAME AS ORIGIN_CITY_SHORT_NAME, ' +
        'RoutesCityCountryLang.DEST_COUNTRY_CODE AS DEST_COUNTRY_CODE, ' +
        'CityTransDest.CITY_NAME AS DEST_CITY_NAME, ' +
        'CityTransDest.CITY_ALT_NAME AS DEST_CITY_ALT_NAME, ' +
        'CityTransDest.CITY_SHORT_NAME AS DEST_CITY_SHORT_NAME, ' +
        'RoutesCityCountryLang.COUNTRY_LANG AS LANG, ' +
        'RoutesCityCountryLang.COUNTRY_CURRENCY AS COUNTRY_CURRENCY, ' +
        'RoutesCityCountryLang.COUNTRY_CURRENCY_SYMBOL ' +
        'AS COUNTRY_CURRENCY_SYMBOL ' +
        'FROM ' + getTablePath_('Step2') + ' AS RoutesCityCountryLang ' +
        'LEFT JOIN ' + getTablePath_('City_translations') +
        ' AS CityTransOrigin ' +
        'ON ' +
        'RoutesCityCountryLang.ORIGIN = CityTransOrigin.AIRPORT_CODE ' +
        'AND RoutesCityCountryLang.COUNTRY_LANG = CityTransOrigin.LANG ' +
        'LEFT JOIN ' + getTablePath_('City_translations') +
        ' AS CityTransDest ' +
        'ON ' +
        'RoutesCityCountryLang.DEST = CityTransDest.AIRPORT_CODE ' +
        'AND RoutesCityCountryLang.COUNTRY_LANG = CityTransDest.LANG',

    'Step4': 'SELECT ' +
        'RoutesCityCountryLang.ORIGIN AS ORIGIN, ' +
        'RoutesCityCountryLang.DEST AS DEST, ' +
        'RoutesCityCountryLang.FLIGHT_TYPE AS FLIGHT_TYPE, ' +
        'RoutesCityCountryLang.ROUTE_TYPE AS ROUTE_TYPE, ' +
        'RoutesCityCountryLang.HAS_FIRST_CLASS AS HAS_FIRST_CLASS, ' +
        'RoutesCityCountryLang.AIRLINE_TIER AS AIRLINE_TIER, ' +
        'RoutesCityCountryLang.ENABLED AS ENABLED, ' +
        'RoutesCityCountryLang.ORIGIN_COUNTRY_CODE AS ORIGIN_COUNTRY_CODE, ' +
        'RoutesCityCountryLang.ORIGIN_CITY_NAME AS ORIGIN_CITY_NAME_LL, ' +
        'RoutesCityCountryLang.ORIGIN_CITY_ALT_NAME AS ' +
        'ORIGIN_CITY_ALT_NAME_LL, ' +
        'RoutesCityCountryLang.ORIGIN_CITY_SHORT_NAME AS ' +
        'ORIGIN_CITY_SHORT_NAME_LL, ' +
        'OriginEnglishTrans.CITY_NAME AS ORIGIN_CITY_NAME_EN, ' +
        'OriginEnglishTrans.CITY_ALT_NAME AS ORIGIN_CITY_ALT_NAME_EN, ' +
        'OriginEnglishTrans.CITY_SHORT_NAME AS ORIGIN_CITY_SHORT_NAME_EN, ' +
        'RoutesCityCountryLang.DEST_COUNTRY_CODE AS DEST_COUNTRY_CODE, ' +
        'RoutesCityCountryLang.DEST_CITY_NAME AS DEST_CITY_NAME_LL, ' +
        'RoutesCityCountryLang.DEST_CITY_ALT_NAME AS DEST_CITY_ALT_NAME_LL, ' +
        'RoutesCityCountryLang.DEST_CITY_SHORT_NAME AS ' +
        'DEST_CITY_SHORT_NAME_LL, ' +
        'DestEnglishTrans.CITY_NAME AS DEST_CITY_NAME_EN, ' +
        'DestEnglishTrans.CITY_ALT_NAME AS DEST_CITY_ALT_NAME_EN, ' +
        'DestEnglishTrans.CITY_SHORT_NAME AS DEST_CITY_SHORT_NAME_EN, ' +
        'RoutesCityCountryLang.LANG AS LANG, ' +
        'RoutesCityCountryLang.COUNTRY_CURRENCY AS CURRENCY, ' +
        'RoutesCityCountryLang.COUNTRY_CURRENCY_SYMBOL AS CURRENCY_SYMBOL ' +
        'FROM ' + getTablePath_('Step3') + ' AS RoutesCityCountryLang ' +
        'LEFT JOIN ' + getTablePath_('City_translations') +
        ' AS OriginEnglishTrans ' +
        'ON ' +
        'RoutesCityCountryLang.ORIGIN = OriginEnglishTrans.AIRPORT_CODE ' +
        'LEFT JOIN ' + getTablePath_('City_translations') +
        ' AS DestEnglishTrans ' +
        'ON ' +
        'RoutesCityCountryLang.DEST = DestEnglishTrans.AIRPORT_CODE ' +
        'WHERE ' +
        'OriginEnglishTrans.LANG = \'EN\' ' +
        'AND DestEnglishTrans.LANG = \'EN\'',

    'Step5': 'SELECT ' +
        'RoutesCityEN.ORIGIN, ' +
        'RoutesCityEN.DEST, ' +
        'RoutesCityEN.FLIGHT_TYPE, ' +
        'RoutesCityEN.ROUTE_TYPE, ' +
        'RoutesCityEN.HAS_FIRST_CLASS, ' +
        'RoutesCityEN.AIRLINE_TIER, ' +
        'RoutesCityEN.ENABLED, ' +
        'RoutesCityEN.ORIGIN_COUNTRY_CODE, ' +
        'RoutesCityEN.ORIGIN_CITY_NAME_LL, ' +
        'RoutesCityEN.ORIGIN_CITY_ALT_NAME_LL, ' +
        'RoutesCityEN.ORIGIN_CITY_SHORT_NAME_LL, ' +
        'RoutesCityEN.ORIGIN_CITY_NAME_EN, ' +
        'RoutesCityEn.ORIGIN_CITY_ALT_NAME_EN, ' +
        'RoutesCityEn.ORIGIN_CITY_SHORT_NAME_EN, ' +
        'CountryTransOrigin.COUNTRY_NAME AS ORIGIN_COUNTRY_NAME, ' +
        'CountryTransOrigin.COUNTRY_ALT_NAME AS ORIGIN_COUNTRY_ALT_NAME, ' +
        'CountryTransOrigin.COUNTRY_SHORT_NAME AS ORIGIN_COUNTRY_SHORT_NAME, ' +
        'CountryTransOrigin.REGION AS ORIGIN_REGION, ' +
        'RoutesCityEN.DEST_COUNTRY_CODE, ' +
        'RoutesCityEN.DEST_CITY_NAME_LL, ' +
        'RoutesCityEN.DEST_CITY_ALT_NAME_LL, ' +
        'RoutesCityEN.DEST_CITY_SHORT_NAME_LL, ' +
        'RoutesCityEN.DEST_CITY_NAME_EN, ' +
        'RoutesCityEN.DEST_CITY_ALT_NAME_EN, ' +
        'RoutesCityEN.DEST_CITY_SHORT_NAME_EN, ' +
        'CountryTransDest.COUNTRY_NAME AS DEST_COUNTRY_NAME, ' +
        'CountryTransDest.COUNTRY_ALT_NAME AS DEST_COUNTRY_ALT_NAME, ' +
        'CountryTransDest.COUNTRY_SHORT_NAME AS DEST_COUNTRY_SHORT_NAME, ' +
        'CountryTransDest.REGION AS DEST_REGION, ' +
        'RoutesCityEN.LANG, ' +
        'RoutesCityEN.CURRENCY, ' +
        'RoutesCityEN.CURRENCY_SYMBOL ' +
        'FROM ' + getTablePath_('Step4') + ' AS RoutesCityEN ' +
        'LEFT JOIN ' + getTablePath_('Country_translations') +
        ' AS CountryTransOrigin ' +
        'ON ' +
        'RoutesCityEN.ORIGIN_COUNTRY_CODE = CountryTransOrigin.COUNTRY_CODE ' +
        'AND RoutesCityEN.LANG = CountryTransOrigin.LANG ' +
        'LEFT JOIN ' + getTablePath_('Country_translations') +
        ' AS CountryTransDest ' +
        'ON ' +
        'RoutesCityEN.DEST_COUNTRY_CODE = CountryTransDest.COUNTRY_CODE ' +
        'AND RoutesCityEN.LANG = CountryTransDest.LANG',

    'Step6': 'SELECT ' +
        'CONCAT(RouteCityCountry.ORIGIN, \'-\', RouteCityCountry.DEST) ' +
        'AS ROUTE, ' +
        'RouteCityCountry.ORIGIN, ' +
        'RouteCityCountry.DEST, ' +
        'RouteCityCountry.FLIGHT_TYPE, ' +
        'RouteCityCountry.ROUTE_TYPE, ' +
        'RouteCityCountry.HAS_FIRST_CLASS, ' +
        'RouteCityCountry.AIRLINE_TIER, ' +
        'RouteCityCountry.ENABLED, ' +
        'RouteCityCountry.ORIGIN_COUNTRY_CODE, ' +
        'RouteCityCountry.ORIGIN_CITY_NAME_LL, ' +
        'RouteCityCountry.ORIGIN_CITY_ALT_NAME_LL, ' +
        'RouteCityCountry.ORIGIN_CITY_SHORT_NAME_LL, ' +
        'RouteCityCountry.ORIGIN_CITY_NAME_EN, ' +
        'RouteCityCountry.ORIGIN_CITY_ALT_NAME_EN, ' +
        'RouteCityCountry.ORIGIN_CITY_SHORT_NAME_EN, ' +
        'RouteCityCountry.ORIGIN_COUNTRY_NAME AS ORIGIN_COUNTRY_NAME_LL, ' +
        'RouteCityCountry.ORIGIN_COUNTRY_ALT_NAME AS ' +
        'ORIGIN_COUNTRY_ALT_NAME_LL, ' +
        'RouteCityCountry.ORIGIN_COUNTRY_SHORT_NAME AS ' +
        'ORIGIN_COUNTRY_SHORT_NAME_LL, ' +
        'OriginCountryEN.COUNTRY_NAME AS ORIGIN_COUNTRY_NAME_EN, ' +
        'OriginCountryEN.COUNTRY_ALT_NAME AS ORIGIN_COUNTRY_ALT_NAME_EN, ' +
        'OriginCountryEN.COUNTRY_SHORT_NAME AS ORIGIN_COUNTRY_SHORT_NAME_EN, ' +
        'RouteCityCountry.ORIGIN_REGION, ' +
        'RouteCityCountry.DEST_COUNTRY_CODE, ' +
        'RouteCityCountry.DEST_CITY_NAME_LL, ' +
        'RouteCityCountry.DEST_CITY_ALT_NAME_LL, ' +
        'RouteCityCountry.DEST_CITY_SHORT_NAME_LL, ' +
        'RouteCityCountry.DEST_CITY_NAME_EN, ' +
        'RouteCityCountry.DEST_CITY_ALT_NAME_EN, ' +
        'RouteCityCountry.DEST_CITY_SHORT_NAME_EN, ' +
        'RouteCityCountry.DEST_COUNTRY_NAME AS DEST_COUNTRY_NAME_LL, ' +
        'RouteCityCountry.DEST_COUNTRY_ALT_NAME AS DEST_COUNTRY_ALT_NAME_LL, ' +
        'RouteCityCountry.DEST_COUNTRY_SHORT_NAME AS ' +
        'DEST_COUNTRY_SHORT_NAME_LL, ' +
        'DestCountryEN.COUNTRY_NAME AS DEST_COUNTRY_NAME_EN, ' +
        'DestCountryEN.COUNTRY_ALT_NAME AS DEST_COUNTRY_ALT_NAME_EN, ' +
        'DestCountryEN.COUNTRY_SHORT_NAME AS DEST_COUNTRY_SHORT_NAME_EN, ' +
        'RouteCityCountry.DEST_REGION, ' +
        'RouteCityCountry.LANG, ' +
        'RouteCityCountry.CURRENCY, ' +
        'RouteCityCountry.CURRENCY_SYMBOL ' +
        'FROM ' + getTablePath_('Step5') + ' AS RouteCityCountry ' +
        'LEFT JOIN ' + getTablePath_('Country_translations') +
        ' AS OriginCountryEN ' +
        'ON ' +
        'RouteCityCountry.ORIGIN_COUNTRY_CODE = OriginCountryEN.COUNTRY_CODE ' +
        'LEFT JOIN ' + getTablePath_('Country_translations') +
        ' AS DestCountryEN ' +
        'ON ' +
        'RouteCityCountry.DEST_COUNTRY_CODE = DestCountryEN.COUNTRY_CODE ' +
        'WHERE ' +
        'OriginCountryEN.LANG = \'EN\' ' +
        'AND DestCountryEN.LANG = \'EN\'',

    'Step7': 'SELECT ' +
        'RoutesCityCountryLang.*, ' +
        'Landing.SITE_EDITION, ' +
        'Landing.LANDING_PAGE AS URL ' +
        'FROM ' + getTablePath_('Step6') + ' AS RoutesCityCountryLang ' +
        'JOIN ' + getTablePath_('Landing_pages') + ' AS Landing ' +
        'ON ' +
        'RoutesCityCountryLang.ROUTE = Landing.ROUTE ' +
        'AND LOWER(RoutesCityCountryLang.LANG) = LOWER(Landing.LANGUAGE)',

    'Step8': 'SELECT * ' +
        'FROM ( ( ' +
        'SELECT ' +
        'CONCAT(Step7.ROUTE, \'-\', Step7.LANG, \'-\', Classes.CLASS_CODE) AS ' +
        'OFFER_ID, Step7.*, ' +
        'Classes.CLASS_ID, ' +
        'Classes.CLASS_CODE, ' +
        'Classes.CLASS_NAME ' +
        'FROM ' + getTablePath_('Step7') + ' AS Step7 ' +
        'CROSS JOIN ' + getTablePath_('Classes') + ' AS Classes ' +
        'WHERE ' +
        'Classes.CLASS_ID = \'0\' ' +
        'OR CLASSES.CLASS_ID = \'1\') ' +
        'UNION ALL ( ' +
        'SELECT ' +
        'CONCAT(Step7.ROUTE, \'-\', Step7.LANG, \'-\', Classes.CLASS_CODE) AS ' +
        'OFFER_ID, Step7.*, ' +
        'Classes.CLASS_ID, ' +
        'Classes.CLASS_CODE, ' +
        'Classes.CLASS_NAME ' +
        'FROM ' + getTablePath_('Step7') + ' AS Step7 ' +
        'CROSS JOIN ' + getTablePath_('Classes') + ' AS Classes ' +
        'WHERE ' +
        'Classes.CLASS_ID = \'2\' ' +
        'AND Step7.HAS_FIRST_CLASS = \'YES\') ' +
        'ORDER BY OFFER_ID)'
  };

  return views;
}

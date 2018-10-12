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

var scriptProperties = PropertiesService.getScriptProperties();

var CONFIG = {
  cloudProjectID: scriptProperties.getProperty('cloudProjectID'),
  bqDatasetID: scriptProperties.getProperty('bqDatasetID'),
  cloudStorageDest: scriptProperties.getProperty('cloudStorageDest'),
  baseSchema: [
    {
      id: 'Routes',
      fields: [
        {name: 'ORIGIN', type: 'STRING'},
        {name: 'DESTINATION', type: 'STRING'},
        {name: 'FLIGHT_TYPE', type: 'STRING'},
        {name: 'HAS_FIRST_CLASS', type: 'STRING'},
        {name: 'AIRLINE_TIER', type: 'STRING'},
        {name: 'ENABLED', type: 'STRING'}
      ],
      driveUri: scriptProperties.getProperty('routesSheet')
    },
    {
      id: 'City_translations',
      fields: [
        {name: 'AIRPORT_CODE', type: 'STRING'},
        {name: 'COUNTRY_CODE', type: 'STRING'},
        {name: 'LANG', type: 'STRING'},
        {name: 'CITY_NAME', type: 'STRING'},
        {name: 'CITY_ALT_NAME', type: 'STRING'},
        {name: 'CITY_SHORT_NAME', type: 'STRING'}
      ],
      driveUri: scriptProperties.getProperty('cityTranslationsSheet')
    },
    {
      id: 'Country_translations',
      fields: [
        {name: 'COUNTRY_CODE', type: 'STRING'},
        {name: 'LANG', type: 'STRING'},
        {name: 'COUNTRY_NAME', type: 'STRING'},
        {name: 'COUNTRY_ALT_NAME', type: 'STRING'},
        {name: 'COUNTRY_SHORT_NAME', type: 'STRING'},
        {name: 'REGION', type: 'STRING'}
      ],
      driveUri: scriptProperties.getProperty('countryTranslationsSheet')
    },
    {
      id: 'Country_languages',
      fields: [
        {name: 'COUNTRY_CODE', type: 'STRING'},
        {name: 'LANG', type: 'STRING'},
        {name: 'CURRENCY', type: 'STRING'},
        {name: 'CURRENCY_SYMBOL', type: 'STRING'}
      ],
      driveUri: scriptProperties.getProperty('countryLanguagesSheet')
    },
    {
      id: 'Landing_pages',
      fields: [
        {name: 'ROUTE', type: 'STRING'},
        {name: 'COUNTRY_CODE', type: 'STRING'},
        {name: 'LANGUAGE', type: 'STRING'},
        {name: 'SITE_EDITION', type: 'STRING'},
        {name: 'LANDING_PAGE', type: 'STRING'}
      ],
      driveUri: scriptProperties.getProperty('landingPagesSheet')
    },
    {
      id: 'Classes',
      fields: [
        {name: 'CLASS_ID', type: 'STRING'},
        {name: 'CLASS_CODE', type: 'STRING'},
        {name: 'CLASS_NAME', type: 'STRING'}
      ],
      driveUri: scriptProperties.getProperty('classesSheet')
    }
  ]
};

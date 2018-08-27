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


/** Create new BQ tables and views in dataset **/
function setup() {
  var views = loadViewQueries_();

  buildBQTables_(CONFIG['cloudProjectID'], CONFIG['bqDatasetID'], CONFIG.baseSchema);
  buildBQViews_(CONFIG['cloudProjectID'], CONFIG['bqDatasetID'], views);
}

/**
 *This is the main function of the script
 * the apps script scheduling trigger should
 * call this one.
 */
function run() {
  runExportQuery_(
      CONFIG['cloudProjectID'], CONFIG['bqDatasetID'],
      'SELECT * FROM ' + getTablePath_('Step8'), CONFIG['cloudStorageDest']);
}

/** Initializes a new sheet with the recommended data structure **/
function initSheet() {
  var sheetFile = SpreadsheetApp.openByUrl(CONFIG['sheetUrl']);

  CONFIG['baseSchema'].forEach(function(tableItem) {
    var newSheet = sheetFile.getSheetByName(tableItem.id);

    if (newSheet != null) {
      throw Utilities.formatString(
          'Sheet %s already exists. Update it manually, run init on an empty sheet only.',
          tableItem.id);
    } else {
      newSheet = sheetFile.insertSheet();
      newSheet.setName(tableItem.id);

      var colNames = tableItem.fields.map(function(field) {
        return field.name;
      });

      newSheet.getRange(1, 1, 1, colNames.length).setValues([colNames]);
      newSheet.deleteColumns((colNames.length + 1), (26 - colNames.length));
    }
  });
}

/**
 * Creates BQ Schema for the dataset based on the current sheet file data
 * @param {object} sheetFile
 * @param {string} Uri
 * @return {object} tableSchema
 */
function generateBQSchema_(sheetFile, Uri) {
  var sheet = sheetFile.getSheets()[0];
  var columns = getSheetColumns_(sheet);
  var tableFields = [];

  columns[0].forEach(function(column) {
    if (column.trim().length > 0) {
      tableFields.push({name: column, type: 'STRING'});
    }
  });

  return {id: sheet.getName(), fields: tableFields, sourceUri: Uri};
}


/**
 * Connects a Google sheet with BQ as federated data source
 * @param {string} cloudProjectId
 * @param {string} bqDatasetId
 * @param {string} tableSchema
 */
function connectSheetToBQ_(cloudProjectId, bqDatasetId, tableSchema) {
  var job = {
    tableReference: {
      projectId: cloudProjectId,
      datasetId: bqDatasetId,
      tableId: tableSchema['id']
    },
    schema: {'fields': tableSchema['fields']},
    externalDataConfiguration: {
      'sourceUris': [tableSchema['sourceUri']],
      'sourceFormat': 'GOOGLE_SHEETS',
      'autodetect': true,
    }
  };

  try {
    BigQuery.Tables.insert(job, cloudProjectId, bqDatasetId);
    Logger.log(
        'Load job started. Check on the status of it here: ' +
            'https://bigquery.cloud.google.com/jobs/%s',
        cloudProjectId);

  } catch (e) {
    Logger.log(e);
  }
}

/**
 * Runs a query job on BQ and exports the results of the temp table
 * into a cloud storage bucket.
 *
 * @param {string} projectId
 * @param {string} dataSetId
 * @param {string} targetQuery
 * @param {string} cloudStorageDest
 */
function runExportQuery_(projectId, dataSetId, targetQuery, cloudStorageDest) {
  var request = {
    query: targetQuery,
    useLegacySql: false,
    destinationTable: {projectId: projectId, dataSetId: dataSetId}
  };

  var queryResults = BigQuery.Jobs.query(request, projectId);
  var jobId = queryResults.jobReference.jobId;

  // Check on status of the Query Job.
  var sleepTimeMs = 500;

  while (!queryResults.jobComplete) {
    Utilities.sleep(sleepTimeMs);
    sleepTimeMs *= 2;
    queryResults = BigQuery.Jobs.getQueryResults(projectId, jobId);
  }

  // Reference for the table create as a result of the query (24 hours TTL)
  var tempTable =
      BigQuery.Jobs.get(projectId, jobId).configuration.query.destinationTable;

  // Export the temp table data into cloud storage
  var extractJobRequest = BigQuery.Jobs.insert(
      {
        configuration: {
          extract: {
            destinationFormat: 'csv',
            sourceTable: tempTable,
            destinationUri: cloudStorageDest
          }
        }
      },
      projectId);

  Logger.log(extractJobRequest.jobReference.jobId);
}

/**
 * Creates all the BQ tables based on the config schema
 *
 * @param {string} cloudProjectId
 * @param {string} bqDatasetId
 * @param {array} schemaConfig
 */
function buildBQTables_(cloudProjectId, bqDatasetId, schemaConfig) {
  schemaConfig.forEach(function(tableStructure) {
    var sheet = SpreadsheetApp.openByUrl(tableStructure['driveUri']);
    var tableSchema = generateBQSchema_(sheet, tableStructure['driveUri']);

    connectSheetToBQ_(cloudProjectId, bqDatasetId, tableSchema);
  });
}

/**
 * Creates all the BQ views passed into BQ
 * @param {string} cloudProjectId
 * @param {string} bqDatasetId
 * @param {object} views An object defining the queries for views
 * key as name and value as an SQL query
 */
function buildBQViews_(cloudProjectId, bqDatasetId, views) {
  for (var viewName in views) {
    var viewSQL = views[viewName];

    BigQuery.Tables.insert(
        {
          tableReference: {
            projectId: cloudProjectId,
            datasetId: bqDatasetId,
            tableId: viewName
          },
          view: {query: viewSQL, useLegacySql: false}
        },
        cloudProjectId, bqDatasetId);
  }
}


/**
 * Extracts all column names from a target sheet
 * @param {Object} sheet
 * @return {Array} array of column values of the given sheet
 */
function getSheetColumns_(sheet) {
  return sheet.getRange('1:1').getValues();
}

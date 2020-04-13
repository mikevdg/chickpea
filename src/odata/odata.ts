import * as edm from './docs.oasis-open.org/odata/ns/edm'
import * as cxml from '@wikipathways/cxml'
import * as query from '../query'

/** Return the URL where the document metadata can be retrieved. */
export function metadataURL(baseURL: URL) {
    return new URL("$metadata", baseURL);
}

export function asTable(metadataXML : string, tableName : string)// : query.Table 
{
    //let metadata = edm.document.Schema
    
    let parser = new cxml.Parser();
    // See https://www.npmjs.com/package/@wikipathways/cxml
    let result = parser.parse(metadataXML, edm.document);

    console.log(result);
}

/*
function asTable(jsonString : string) : query.Table {

}*/
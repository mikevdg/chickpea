import * as query from '../query'

/** Return the URL where the document metadata can be retrieved. */
export function metadataURL(baseURL: string) {
    return baseURL+"$metadata";
}

export function tableURL(baseURL: string, tableName: string) {
    return baseURL+tableName;
}

export function asTable(metadataXML: string, tableName: string) : query.Table 
{
    let parser = new DOMParser();
    let xml = parser.parseFromString(metadataXML, "text/xml");
    
    let ns = xml.getElementsByTagName("edmx:Edmx")[0]
    .getElementsByTagName("edmx:DataServices")[0]
    .getElementsByTagName("Schema")[0]
    .getAttribute("Namespace");

    let entities = xml.getElementsByTagName("edmx:Edmx")[0]
        .getElementsByTagName("edmx:DataServices")[0]
        .getElementsByTagName("Schema")[0]
        .getElementsByTagName("EntityContainer")[0]
        .getElementsByTagName("EntitySet");


    for (let i=0; i<entities.length; i++) {
        if (tableName==entities[i].getAttribute("Name")) {
            return findEntity(xml, ns??"", entities[i].getAttribute("EntityType"));
        }
    }
    return emptyTable();
}

function findEntity(xml : Document, namespace: string, entityType : string|null) : query.Table {
    let entities = xml.getElementsByTagName("edmx:Edmx")[0]
    .getElementsByTagName("edmx:DataServices")[0]
    .getElementsByTagName("Schema")[0]
    .getElementsByTagName("EntityType");

    for (let i=0; i<entities.length; i++) {
        if (entityType==namespace+"."+entities[i].getAttribute("Name")) {
            return createTableFrom(entities[i]);
        }
    }
    return emptyTable();
}

export function emptyTable() : query.Table {
    return {
        name:"Error - empty table",
        query:{},
        columns:[],
        contents:[]
    };
}

function createTableFrom(entity : Element) : query.Table {
    let columns : Array<query.ColumnDefinition> = [];
    let properties = entity.getElementsByTagName("Property");
    
    for (let i=0; i<properties.length; i++) {
        columns.push({
            name:(properties[i].getAttribute("Name")??"Unnamed Column"),
            type:query.ColumnType.String
        });
    }

    let result : query.Table = {
        name: (entity.getAttribute("Name") ?? "Error"),
        query: {},
        columns:columns,
        contents:[]
    }
    return result;
}

/** contents could be JSON or Atom. */
export function setContents(table : query.Table, contents : string) {
    let obj = JSON.parse(contents);
    let result : Array<query.Row> = [];

    for (let i=0; i<obj.value.length; i++) {
        let current : Array<string> = []; // TODO: multiple types.
        let currentRow = obj.value[i];
        for (let j=0; j<table.columns.length; j++) {
            current.push(currentRow[table.columns[j].name]);
        }
        result.push({cells:current});
    }
    table.contents = result;
}
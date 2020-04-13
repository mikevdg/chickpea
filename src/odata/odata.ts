import * as query from '../query'

/** Return the URL where the document metadata can be retrieved. */
export function metadataURL(baseURL: URL) {
    return new URL("$metadata", baseURL);
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


/*
function asTable(jsonString : string) : query.Table {

}*/
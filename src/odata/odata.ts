import * as query from '../query'

/** Return the URL where the document metadata can be retrieved. */
export function metadataURL(baseURL: string) {
    return baseURL + "$metadata";
}

export function tableURL(baseURL: string, tableName: string) {
    return baseURL + tableName;
}


/* TODO: load the whole schema into its own object. When a column is 
   expanded, we read from that schema. Bonus: the schema can come
   from JSON or XML.
*/


export function asTable(
    metadataXML: string, 
    tableName: string, 
    expand: Array<string>): query.Table 
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

    for (let i = 0; i < entities.length; i++) {
        if (tableName === entities[i].getAttribute("Name")) {
            return findEntity(ns ?? "", xml, entities[i].getAttribute("EntityType"), expand);
        }
    }
    return emptyTable();
}

function findEntity(namespace: string, xml: Document, entityType: string | null, expand: Array<string>): query.Table {
    let entities = xml.getElementsByTagName("edmx:Edmx")[0]
        .getElementsByTagName("edmx:DataServices")[0]
        .getElementsByTagName("Schema")[0]
        .getElementsByTagName("EntityType");

    for (let i = 0; i < entities.length; i++) {
        if (entityType === namespace + "." + entities[i].getAttribute("Name")) {
            return createTableFrom(entities[i], namespace, xml, expand);
        }
    }
    return emptyTable();
}

export function emptyTable(): query.Table {
    return {
        name: "Error - empty table",
        query: {},
        columns: [],
        contents: []
    };
}

function createTableFrom(
    entity: Element, 
    namespace: string,
    metadata: Document, 
    expand: Array<string> )
    : query.Table 
{
    let columns: Array<query.ColumnDefinition> = [];
    //let properties = entity.getElementsByTagName("Property");
    // TODO: <Key> 

    for (let i = 0; i < entity.children.length; i++) {
        let node = entity.children[i];
        switch (node.nodeName) {
            case 'Property':
            case 'NavigationProperty':
                columns.push(createColumnFrom(node, namespace, metadata, expand));
                break;
            case 'Key':
                console.log('TODO: process keys.');
                break;
            default:
                console.log('Unknown node name: ' + node.nodeName);
        }
    }

    let result: query.Table = {
        name: (entity.getAttribute("Name") ?? "Error"),
        query: {},
        columns: columns,
        contents: []
    }
    return result;
}

function createColumnFrom(node: Element, namespace: string, metadata: Document, expand: Array<string>) {
    let name: string;
    let typeString: string;
    let isCollection: boolean = false;

    // Pull out the name.
    name = node.getAttribute("Name") ?? "Unnamed Column";
    typeString = node.getAttribute("Type") ?? "Edm.String";

    // Is it a collection?
    const collection = "Collection(";
    if (typeString.startsWith(collection)) {
        isCollection = true;
        typeString = typeString.substring(collection.length, typeString.length);
        if (typeString.endsWith(")")) {
            typeString = typeString.substring(0, typeString.length - 1);
        }
    }

    let typeOrNull = toPrimitiveType(typeString);
    if (null===typeOrNull) {
        return {
            name: name, 
            type: {isExpanded:false, columns:[]}, 
            isCollection: isCollection
        };
    } else {
        return { name: name, type: typeOrNull, isCollection: isCollection };
    }
}

/** contents could be JSON or Atom. */
export function setContents(table: query.Table, contents: string) {
    let obj = JSON.parse(contents);
    let result: Array<query.Row> = [];

    for (let i = 0; i < obj.value.length; i++) {
        let current: Array<string> = []; // TODO: multiple types.
        let currentRow = obj.value[i];
        for (let j = 0; j < table.columns.length; j++) {
            current.push(currentRow[table.columns[j].name]);
        }
        result.push({ cells: current });
    }
    table.contents = result;
}

function toPrimitiveType(type: string) : query.PrimitiveType | null {
    switch (type) {
        case 'Edm.Binary': return query.PrimitiveType.Binary
        case 'Edm.Boolean': return query.PrimitiveType.Boolean
        case 'Edm.Byte': return query.PrimitiveType.Byte
        case 'Edm.Date': return query.PrimitiveType.Date
        case 'Edm.DateTimeOffset': return query.PrimitiveType.DateTimeOffset
        case 'Edm.Decimal': return query.PrimitiveType.Decimal
        case 'Edm.Double': return query.PrimitiveType.Double
        case 'Edm.Duration': return query.PrimitiveType.Duration
        case 'Edm.Guid': return query.PrimitiveType.Guid
        case 'Edm.Int16 ': return query.PrimitiveType.Int16
        case 'Edm.Int32': return query.PrimitiveType.Int32
        case 'Edm.Int64': return query.PrimitiveType.Int64
        case 'Edm.SByte': return query.PrimitiveType.SByte
        case 'Edm.Single': return query.PrimitiveType.Single
        case 'Edm.Stream': return query.PrimitiveType.Stream
        case 'Edm.String': return query.PrimitiveType.String
        case 'Edm.TimeOfDay': return query.PrimitiveType.TimeOfDay
        case 'Edm.Geography': return query.PrimitiveType.Geography
        case 'Edm.GeographyPoint': return query.PrimitiveType.GeographyPoint
        case 'Edm.GeographyLineString': return query.PrimitiveType.GeographyLineString
        case 'Edm.GeographyPolygon': return query.PrimitiveType.GeographyPolygon
        case 'Edm.GeographyMultiPoint': return query.PrimitiveType.GeographyMultiPoint
        case 'Edm.GeographyMultiLineString': return query.PrimitiveType.GeographyMultiLineString
        case 'Edm.GeographyMultiPolygon': return query.PrimitiveType.GeographyMultiPolygon
        case 'Edm.GeographyCollection': return query.PrimitiveType.GeographyCollection
        case 'Edm.Geometry': return query.PrimitiveType.Geometry
        case 'Edm.GeometryPoint': return query.PrimitiveType.GeometryPoint
        case 'Edm.GeometryLineString': return query.PrimitiveType.GeometryLineString
        case 'Edm.GeometryPolygon': return query.PrimitiveType.GeometryPolygon
        case 'Edm.GeometryMultiPoint': return query.PrimitiveType.GeometryMultiPoint
        case 'Edm.GeometryMultiLineString': return query.PrimitiveType.GeometryMultiLineString
        case 'Edm.GeometryMultiPolygon': return query.PrimitiveType.GeometryMultiPolygon
        case 'Edm.GeometryCollection': return query.PrimitiveType.GeometryCollection
        default: return null;
    }
}
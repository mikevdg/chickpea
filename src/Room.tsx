import React from 'react';
import * as query from './query';

import * as WebRequest from 'web-request';
import * as OData from './odata/odata';

/* A room contains the state of a table - the data, a list of edits, the selected row, the selected column, etc.

You put DataTables and other components inside me.

Any component inside me gets updated with the currently selected row and any
edited elements in that table.
*/

export interface RoomProps {
    children: React.ReactNode;
    query: query.Query;
}

export interface RoomState {
    query: query.Query;
}

export class Room extends React.Component<RoomProps, RoomState> {
    constructor(props: Readonly<RoomProps>) {
        super(props);
        this.state = { query: props.query };
        this.refetch = this.refetch.bind(this);
        this.render = this.render.bind(this);
    }

    componentDidMount() {
        this.refetch(this.state.query.copy());
    }

    async refetch(table: query.Query) {
        await refetch(table);
        this.setState({ query: table });
    }

    //React.Children.forEach(children, (each) => console.log("Child: "+each));

    render() {
        return React.Children.map(this.props.children, (each) =>
            React.cloneElement(each as React.ReactElement<any>,
                { table: this.state.query, refetch: this.refetch }));
    }
}   


async function refetch(t: query.Query) {
    // See https://www.npmjs.com/package/web-request
    let url = t.url();

    let metadata = WebRequest.get(OData.metadataURL(t._baseURL));
    OData.setTableColumns(t, (await metadata).content, t._tableName);

    let cells = WebRequest.get(url);
    OData.setContents(t, (await cells).content);
}